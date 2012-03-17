package com.clooca.core.client.presenter;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.listener.DiagramModificationListener;
import com.clooca.core.client.model.gopr.element.Diagram;
import com.clooca.core.client.model.gopr.element.NodeObject;
import com.clooca.core.client.model.gopr.element.Property;
import com.clooca.core.client.model.gopr.element.Relationship;
import com.clooca.core.client.model.gopr.metaelement.Binding;
import com.clooca.core.client.model.gopr.metaelement.MetaObject;
import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
import com.clooca.core.client.model.gopr.metaelement.MetaRelation;
import com.clooca.core.client.util.ElementSelectionListener;
import com.clooca.core.client.util.GraphicManager;
import com.clooca.core.client.util.IdGenerator;
import com.clooca.core.client.util.Line2D;
import com.clooca.core.client.util.Point2D;
import com.clooca.core.client.util.Rectangle2D;
import com.clooca.core.client.view.DiagramEditor.Tool;
import com.google.gwt.core.client.GWT;

public class DiagramController {
	Diagram diagram;
//	DiagramEditor deditor;
	
	List<DiagramModificationListener> dm_listeners = new ArrayList<DiagramModificationListener>();
	
	public void addDiagramModificationListener(DiagramModificationListener l) {
		dm_listeners.add(l);
	}
	
	public DiagramController(Diagram diagram) {
		this.diagram = diagram;
	}
	
	public Diagram getDiagram() {
		return diagram;
	}
	
	private enum DragMode {DRAG_RUBBERBAND, DRAG_MOVE, DRAG_NONE, DRAG_POINT, DRAG_RANGE};

	private DragMode dragMode = DragMode.DRAG_NONE;
	
	Point2D drag_move = new Point2D();
	Point2D drag_start = new Point2D();
	Point2D drag_end = new Point2D();
	
	public void draw(GraphicManager gm) {
		if(dragMode == DragMode.DRAG_RUBBERBAND) {
			gm.beginPath();
			gm.setColor("BLACK");
			gm.moveTo(drag_start);
			gm.LineTo(drag_move);
			gm.stroke();
			gm.closePath();
		}
	}
	
	public void downAction(double x, double y, Tool tool) {
		if(tool.getToolKind() == null) {
			if(clicknode(x, y)) {
				dragMode = DragMode.DRAG_MOVE;
			} else if(clickedge(x, y) && this.selected instanceof Relationship) {
				dragMode = DragMode.DRAG_POINT;
			} else if(clickedge(x, y)) {
				
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
		}else if(dragMode == DragMode.DRAG_POINT) {
			if(selected instanceof Relationship) {
				this.movePoint((Relationship)selected, drag_start, drag_end);
			}
		}
		dragMode = DragMode.DRAG_NONE;
	}
	
	/**
	 * 
	 * @param x
	 * @param y
	 * @return if repaint
	 */
	public boolean moveAction(double x, double y) {
		drag_move.x = x;
		drag_move.y = y;
		if(dragMode == DragMode.DRAG_NONE) {
			return false;
		}else if(dragMode == DragMode.DRAG_MOVE) {
			if(selected instanceof NodeObject) {
				NodeObject selected_obj = (NodeObject)selected;
				transition(selected_obj, x, y);
			}
			return true;
		}else if(dragMode == DragMode.DRAG_RUBBERBAND) {
			return true;
		}else if(dragMode == DragMode.DRAG_POINT) {
			if(selected instanceof Relationship) {
				this.movePoint((Relationship)selected, drag_start, drag_move);
			}
		}
		return true;
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
			if(ckick_a_edge(rel, x, y)) return true;
		}
		return false;
	}
	
	private boolean ckick_a_edge(Relationship rel, double x, double y) {
		List<Point2D> points = new ArrayList<Point2D>();
    	Point2D s = new Point2D((rel.src.pos.x + rel.src.bound.width / 2), (rel.src.pos.y + rel.src.bound.height / 2));
    	Point2D e = new Point2D((rel.dest.pos.x + rel.dest.bound.width / 2), (rel.dest.pos.y + rel.dest.bound.height / 2));
    	points.add(s);
    	points.addAll(rel.points);
    	points.add(e);
    	for(int i=0;i < points.size() - 1;i++) {
    		if((new Line2D(points.get(i), points.get(i+1))).ptSegDist(x, y) < 14) {
    			selected = rel;
    			this.fireSelectElement(selected);
    			return true;
    		}
    	}
    	return false;
	}
	
	private void addPoint(Relationship rel, Point2D p) {
		if(rel == null) return;
		if(rel.points.size() < 2) {
			rel.points.add(new Point2D(p.x, p.y));
		}
	}
	
	public void deletePoint() {
		if(selected instanceof Relationship) {
			deletePoint((Relationship)selected);
		}
	}
	
	private void deletePoint(Relationship rel) {
		if(rel == null) return;
		int size = rel.points.size();
		for(int i=0;i < size;i++) {
			rel.points.remove(0);
		}
	}
	
	private void movePoint(Relationship rel, Point2D src, Point2D dest) {
		if(rel != null) {
			boolean flg = true;
			for(Point2D p : rel.points) {
				if(p.distanceSq(src) < 14) {
					p.x = dest.x;
					p.y = dest.y;
					flg = false;
				}
			}
			if(flg) {
				addPoint(rel, dest);
			}
		}
	}
	
	public void deleteElement() {
		if(selected instanceof NodeObject) {
			deleteObject((NodeObject)selected);
		}
		if(selected instanceof Relationship) {
			deleteRelationship((Relationship)selected);
		}
	}

	private void deleteObject(NodeObject obj) {
			List<Relationship> remove_rels = new ArrayList<Relationship>();
			for(Relationship rel : this.diagram.relationships) {
				if(rel.src.id == obj.id || rel.dest.id == obj.id) {
					remove_rels.add(rel);
				}
			}
			this.diagram.relationships.removeAll(remove_rels);
			this.diagram.nodes.remove(obj);
			this.fireOnDeleteObject(obj);
	}
	
	private void deleteRelationship(Relationship rel) {
			this.diagram.relationships.remove(rel);
			this.fireOnDeleteRelationship(rel);
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
			/*
			 * setting default value
			 */
			if(prop.meta.widget.matches(MetaProperty.FIXED_LIST)) {
				String[] list = prop.meta.exfield.split("&");
				prop.content = list[0];
			}
			obj.properties.add(prop);
		}
		diagram.nodes.add(obj);
		this.transition(obj, pos.x, pos.y);
		this.fireOnAddObject(obj);
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
				/*
				 * setting default value
				 */
				if(prop.meta.widget.matches(MetaProperty.FIXED_LIST)) {
					String[] list = prop.meta.exfield.split("&");
					prop.content = list[0];
				}
				rel.properties.add(prop);
			}
			diagram.relationships.add(rel);
			this.fireOnAddRelationship(rel);
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
	
	private void fireOnAddObject(NodeObject obj) {
		for(DiagramModificationListener l : dm_listeners) {
			l.onAddObject(obj);
		}
	}
	
	private void fireOnAddRelationship(Relationship rel) {
		for(DiagramModificationListener l : dm_listeners) {
			l.onAddRelationship(rel);
		}
	}
	
	private void fireOnDeleteObject(NodeObject obj) {
		for(DiagramModificationListener l : dm_listeners) {
			l.onDeleteObject(obj);
		}
	}
	
	private void fireOnDeleteRelationship(Relationship rel) {
		for(DiagramModificationListener l : dm_listeners) {
			l.onDeleteRelationship(rel);
		}
	}
	
	private void fireOnUpdateObject(NodeObject obj) {
		for(DiagramModificationListener l : dm_listeners) {
			l.onUpdateObject(obj);
		}
	}
	
	private void fireOnUpdateRelationship(Relationship rel) {
		for(DiagramModificationListener l : dm_listeners) {
			l.onUpdateRelationship(rel);
		}
	}
	
	/*
	public class DiagramHistoryManager implements DiagramModificationListener {
		
		Stack stack = new Stack<DiagramModification>();
		
		public DiagramHistoryManager() {
			
		}

		@Override
		public void onAddObject(NodeObject obj) {
			stack.add(new DiagramModification(DiagramModification.TYPE.ADDOBJECT, obj));
		}

		@Override
		public void onAddRelationship(Relationship rel) {
			// TODO Auto-generated method stub
			
		}

		@Override
		public void onDeleteObject(NodeObject obj) {
			// TODO Auto-generated method stub
			
		}

		@Override
		public void onDeleteRelationship(Relationship rel) {
			// TODO Auto-generated method stub
			
		}

		@Override
		public void onUpdateObject(NodeObject obj) {
			// TODO Auto-generated method stub
			
		}

		@Override
		public void onUpdateRelationship(Relationship rel) {
			// TODO Auto-generated method stub
			
		}
		
		public class DiagramModification {
			public enum TYPE {
				ADDOBJECT,
				ADDRELATIONSHIP,
				DELETEOBJECT,
				DELETERELATIONSHIP,
				UPDATEOBJECT,
				UPDATERELATIONSHIP,
				}
			
			TYPE type;
			
			Object object;
			
			public DiagramModification(TYPE type, Object o) {
				this.type = type;
				this.object = o;
			}
		}
		
	}
	*/
	
}
