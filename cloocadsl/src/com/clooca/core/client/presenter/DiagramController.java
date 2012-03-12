package com.clooca.core.client.presenter;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.model.gopr.element.Diagram;
import com.clooca.core.client.model.gopr.element.NodeObject;
import com.clooca.core.client.model.gopr.element.Property;
import com.clooca.core.client.model.gopr.element.Relationship;
import com.clooca.core.client.model.gopr.metaelement.Binding;
import com.clooca.core.client.model.gopr.metaelement.MetaObject;
import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
import com.clooca.core.client.model.gopr.metaelement.MetaRelation;
import com.clooca.core.client.util.ElementSelectionListener;
import com.clooca.core.client.util.IdGenerator;
import com.clooca.core.client.util.Line2D;
import com.clooca.core.client.util.Point2D;
import com.clooca.core.client.util.Rectangle2D;
import com.clooca.core.client.view.DiagramEditor;
import com.clooca.core.client.view.DiagramEditor.Tool;
import com.google.gwt.core.client.GWT;

public class DiagramController {
	Diagram diagram;
//	DiagramEditor deditor;
	
	public DiagramController(Diagram diagram) {
		this.diagram = diagram;
	}
	
	public Diagram getDiagram() {
		return diagram;
	}
	
	private enum DragMode {DRAG_RUBBERBAND, DRAG_MOVE, DRAG_NONE, DRAG_POINT, DRAG_RANGE};

	private DragMode dragMode = DragMode.DRAG_NONE;
	Point2D drag_start = new Point2D();
	Point2D drag_end = new Point2D();
	
	public void downAction(double x, double y, Tool tool) {
		if(tool.getToolKind() == null) {
			if(clicknode(x, y)) {
				dragMode = DragMode.DRAG_MOVE;
			} else if(clickedge(x, y)) {
				dragMode = DragMode.DRAG_POINT;
			}else{
				dragMode = DragMode.DRAG_NONE;
				selected = null;
			}
		} else if(tool.getToolKind() instanceof MetaObject) {
			addObject(new Point2D(x, y), (MetaObject)tool.getToolKind());
		} else if(tool.getToolKind() instanceof MetaRelation) {
			dragMode = DragMode.DRAG_RUBBERBAND;
		}
		drag_start.x = x;
		drag_start.y = y;
	}
	
	Object selected;
	
	public void upAction(double x, double y, Tool tool) {
		drag_end.x = x;
		drag_end.y = y;
		if(dragMode == DragMode.DRAG_NONE) {
			
		}else if(dragMode == DragMode.DRAG_MOVE) {
			
		}else if(dragMode == DragMode.DRAG_RUBBERBAND) {
			if(tool.getToolKind() instanceof MetaRelation) {
				addRelationship(drag_start, drag_end, (MetaRelation)tool.getToolKind());
			}
		}
		dragMode = DragMode.DRAG_NONE;
	}
	
	public void moveAction(double x, double y) {
		if(dragMode == DragMode.DRAG_NONE) {
			
		}else if(dragMode == DragMode.DRAG_MOVE) {
			if(selected instanceof NodeObject) {
				NodeObject selected_obj = (NodeObject)selected;
				transition(selected_obj, x, y);
			}
		}else if(dragMode == DragMode.DRAG_RUBBERBAND) {
		}
	}
	
	/**
	 * 
	 * @param x
	 * @param y
	 * @return
	 */
	private boolean clicknode(double x, double y) {
    	for(NodeObject obj : this.diagram.nodes) {
    		Rectangle2D bound = new Rectangle2D(obj.pos.x, obj.pos.y, obj.bound.width, obj.bound.height);
    		if(bound.contains(x, y)) {
    			selected = obj;
    			this.fireSelectElement(selected);
    			return true;
    		}
    	}
    	return false;
	}
	
	private boolean clickedge(double x, double y) {
		for(Relationship rel : this.diagram.relationships) {
	    	Point2D s = new Point2D((rel.src.pos.x + rel.src.bound.width / 2), (rel.src.pos.y + rel.src.bound.height / 2));
	    	Point2D e = new Point2D((rel.dest.pos.x + rel.dest.bound.width / 2), (rel.dest.pos.y + rel.dest.bound.height / 2));
			if((new Line2D(s, e)).ptSegDist(new Point2D(x, y)) < 14) {
    			selected = rel;
    			this.fireSelectElement(selected);
				return true;
			}
		}
		return false;
	}
	
	public void deleteObject() {
		if(selected instanceof NodeObject) {
			NodeObject obj = (NodeObject)selected;
			List<Relationship> remove_rels = new ArrayList<Relationship>();
			for(Relationship rel : this.diagram.relationships) {
				if(rel.src.id == obj.id || rel.dest.id == obj.id) {
					remove_rels.add(rel);
				}
			}
			this.diagram.relationships.removeAll(remove_rels);
			this.diagram.nodes.remove(obj);
		}
	}

	
	static public void transition(NodeObject selected_obj, double x, double y) {
		selected_obj.pos.x = x - 5;
		selected_obj.pos.y = y - 5;
		selected_obj.bound.x = selected_obj.pos.x;
		selected_obj.bound.y = selected_obj.pos.y;
	}
	
	public Object getSelected() {
		return selected;
	}
	
	public void draw() {
		
	}
	
	/*
	 * 
	 */
	List<ElementSelectionListener> listeners = new ArrayList<ElementSelectionListener>();
	
	public void addListeners(ElementSelectionListener l) {
		listeners.add(l);
	}
	
	private void fireSelectElement(Object selected) {
		for(ElementSelectionListener l : listeners) {
			l.OnSelectElement(selected);
		}
	}
	
	private NodeObject addObject(Point2D pos, MetaObject meta_obj) {
		NodeObject obj = new NodeObject();
		obj.id = IdGenerator.getNewLongId();
		obj.meta = meta_obj;
		obj.pos = pos;
		for(MetaProperty metaprop : obj.meta.properties) {
			Property prop = new Property();
			prop.meta = metaprop;
			obj.properties.add(prop);
		}
		diagram.nodes.add(obj);
		this.transition(obj, pos.x, pos.y);
		return obj;
	}
	
	private Relationship addRelationship(Point2D s, Point2D e, MetaRelation meta_rel) {
		NodeObject start = findNode(s);
		NodeObject end = findNode(e);
		if(start != null && end != null) {
			if(!checkBinding(meta_rel, start, end)) return null;
			Relationship rel = new Relationship();
			rel.id = IdGenerator.getNewLongId();
			rel.meta = meta_rel;
			rel.src = start;
			rel.dest = end;
			for(MetaProperty metaprop : rel.meta.properties) {
				Property prop = new Property();
				prop.meta = metaprop;
				rel.properties.add(prop);
			}
			diagram.relationships.add(rel);
			return rel;
		}
		return null;
	}
	
	private boolean checkBinding(MetaRelation mr, NodeObject n1, NodeObject n2) {
		for(Binding b : mr.bindings) {
			GWT.log(b.src.id + "," + b.dest.id);
			if(b.src.id == n1.meta.id) {
				if(b.dest.id == n2.meta.id) {
					return true;
				}
			}
		}
		return false;
	}
	
	private NodeObject findNode(Point2D p) {
    	for(NodeObject obj : this.diagram.nodes) {
    		Rectangle2D bound = new Rectangle2D(obj.pos.x, obj.pos.y, obj.bound.width, obj.bound.height);
    		if(bound.contains(p.getX(), p.getY())) {
    			return obj;
    		}
    	}
    	return null;
	}
	
	static NodeObject getObject(Diagram d, int id) {
		for(NodeObject o : d.nodes) {
			if(o.id == id) return o;
		}
		return null;
	}

}
