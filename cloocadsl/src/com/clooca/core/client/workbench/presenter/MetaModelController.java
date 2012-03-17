package com.clooca.core.client.workbench.presenter;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.model.ProjectInfo;
import com.clooca.core.client.model.gopr.element.Diagram;
import com.clooca.core.client.model.gopr.element.NodeObject;
import com.clooca.core.client.model.gopr.element.Property;
import com.clooca.core.client.model.gopr.element.Relationship;
import com.clooca.core.client.model.gopr.metaelement.Binding;
import com.clooca.core.client.model.gopr.metaelement.MetaDiagram;
import com.clooca.core.client.model.gopr.metaelement.MetaModel;
import com.clooca.core.client.model.gopr.metaelement.MetaObject;
import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
import com.clooca.core.client.model.gopr.metaelement.MetaRelation;
import com.clooca.core.client.presenter.XMLMetaPresenter;
import com.clooca.core.client.util.ElementSelectionListener;
import com.clooca.core.client.util.IdGenerator;
import com.clooca.core.client.util.Line2D;
import com.clooca.core.client.util.Point2D;
import com.clooca.core.client.util.Rectangle2D;
import com.clooca.core.client.view.DiagramEditor;
import com.clooca.core.client.view.DiagramEditor.Tool;
import com.clooca.webutil.client.Console;
import com.clooca.webutil.client.RequestGenerator;
import com.google.gwt.core.client.GWT;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.http.client.URL;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.DialogBox;
import com.sun.org.apache.regexp.internal.RE;

public class MetaModelController {
	static MetaModel metamodel;
//	DiagramEditor deditor;
	
	public MetaModelController() {
		
	}
	
	public MetaModelController(MetaModel metamodel) {
		this.metamodel = metamodel;
	}
	
	static public MetaModel getMetaModel() {
		return metamodel;
	}
	
	public void create_sample() {
		metamodel = new MetaModel();
		metamodel.id = 1;
		metamodel.name = "StateModel";
		metamodel.meta_diagram = new MetaDiagram();
		metamodel.meta_diagram.id = 1;
		
		MetaObject metaobj = new MetaObject();
		metaobj.id = 1;
		metaobj.name = "state";
		metaobj.graphic.shape = "rect";
		
		MetaProperty metaprop = new MetaProperty();
		metaprop.id = 1;
		metaprop.name = "name";
		metaprop.data_type = MetaProperty.STRING;
		metaprop.widget = MetaProperty.INPUT_FIELD;
		metaobj.properties.add(metaprop);
		metamodel.meta_diagram.meta_objects.add(metaobj);
		
		MetaRelation metarel = new MetaRelation();
		metarel.id = 2;
		metarel.name = "transition";
		metarel.bindings.add(new Binding(metaobj, metaobj));
		metamodel.meta_diagram.meta_relations.add(metarel);
	}

	private enum DragMode {DRAG_RUBBERBAND, DRAG_MOVE, DRAG_NONE, DRAG_POINT, DRAG_RANGE};

	private DragMode dragMode = DragMode.DRAG_NONE;
	Point2D drag_start = new Point2D();
	Point2D drag_end = new Point2D();
	
	public void downAction(double x, double y, int tool) {
		if(tool == 0) {
			if(clicknode(x, y)) {
				dragMode = DragMode.DRAG_MOVE;
			} else if(clickedge(x, y)) {
				dragMode = DragMode.DRAG_POINT;
			}else{
				dragMode = DragMode.DRAG_NONE;
				selected = null;
			}
		} else if(tool == 1) {
			addObject(new Point2D(x, y));
		} else if(tool == 2) {
			dragMode = DragMode.DRAG_RUBBERBAND;
		}
		drag_start.x = x;
		drag_start.y = y;
	}
	
	Object selected;
	
	public void upAction(double x, double y, int tool) {
		drag_end.x = x;
		drag_end.y = y;
		if(dragMode == DragMode.DRAG_NONE) {
			
		}else if(dragMode == DragMode.DRAG_MOVE) {
			
		}else if(dragMode == DragMode.DRAG_RUBBERBAND) {
			if(tool == 2) {
				addRelationship(drag_start, drag_end);
			}
		}
		dragMode = DragMode.DRAG_NONE;
	}
	
	public void moveAction(double x, double y) {
		if(dragMode == DragMode.DRAG_NONE) {
			
		}else if(dragMode == DragMode.DRAG_MOVE) {
			if(selected instanceof MetaObject) {
				MetaObject selected_obj = (MetaObject)selected;
				transition(selected_obj, x, y);
//				selected_obj.pos.x = x - 5;
//				selected_obj.pos.y = y - 5;
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
    	for(MetaObject obj : this.metamodel.meta_diagram.meta_objects) {
    		Rectangle2D bound = new Rectangle2D(obj.pos.x, obj.pos.y, 60, 40);
    		if(bound.contains(x, y)) {
    			selected = obj;
    			this.fireSelectElement(selected);
    			return true;
    		}
    	}
    	return false;
	}
	
	private boolean clickedge(double x, double y) {
		for(MetaRelation meta_rel : this.metamodel.meta_diagram.meta_relations) {
			for(Binding b : meta_rel.bindings) {
				Point2D s, e;
				s = b.src.pos;
				e = b.dest.pos;
				if(b.src.id == b.dest.id) {
					boolean flg = false;
					if(Line2D.ptSegDist(b.src.pos.x, b.src.pos.y, b.src.pos.x + 40, b.src.pos.y, x, y) < 14) flg = true;
					if(Line2D.ptSegDist(b.src.pos.x + 40, b.src.pos.y, b.src.pos.x + 40, b.src.pos.y - 40, x, y) < 14) flg = true;
					if(Line2D.ptSegDist(b.src.pos.x + 40, b.src.pos.y - 40, b.src.pos.x, b.src.pos.y - 40, x, y) < 14) flg = true;
					if(flg) {
		    			selected = meta_rel;
		    			this.fireSelectElement(selected);
						return true;
					}
				}else{
					if((new Line2D(s, e)).ptSegDist(new Point2D(x, y)) < 14) {
		    			selected = meta_rel;
		    			this.fireSelectElement(selected);
						return true;
					}
				}
			}
		}
		return false;
	}
	
	public void deleteElement() {
		if(selected instanceof MetaObject) {
			deleteObject((MetaObject)selected);
		}
		if(selected instanceof MetaRelation) {
			deleteRelationship((MetaRelation)selected);
		}
	}
	
	private void deleteObject(MetaObject obj) {
		List<MetaRelation> remove_rels = new ArrayList<MetaRelation>();
		for(MetaRelation rel : this.metamodel.meta_diagram.meta_relations) {
			List<Binding> remove_bins = new ArrayList<Binding>();
			for(Binding b : rel.bindings) {
				if(b.src.id == obj.id || b.dest.id == obj.id) {
					remove_bins.add(b);
				}
			}
			rel.bindings.removeAll(remove_bins);
			if(rel.bindings.size() == 0) remove_rels.add(rel);
		}
		this.metamodel.meta_diagram.meta_objects.remove(obj);
		this.metamodel.meta_diagram.meta_relations.removeAll(remove_rels);
	}
	
	private void deleteRelationship(MetaRelation rel) {
		this.metamodel.meta_diagram.meta_relations.remove(rel);
	}
	
	public void transition(MetaObject selected_obj, double x, double y) {
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
	
	private MetaObject addObject(Point2D pos) {
		MetaObject obj = new MetaObject();
		obj.id = IdGenerator.getNewLongId();
		obj.name = "";
		obj.pos = pos;
		obj.graphic.shape = "rect";
		/*
		for(MetaProperty metaprop : obj.meta.properties) {
			Property prop = new Property();
			prop.meta = metaprop;
			obj.properties.add(prop);
		}
		*/
		this.metamodel.meta_diagram.meta_objects.add(obj);
		return obj;
	}
	
	private MetaRelation addRelationship(Point2D s, Point2D e) {
		MetaObject start = findNode(s);
		MetaObject end = findNode(e);
		if(start != null && end != null) {
			MetaRelation rel = new MetaRelation();
			rel.id = IdGenerator.getNewLongId();
			rel.name = "";
			rel.bindings.add(new Binding(start, end));
			/*
			for(MetaProperty metaprop : rel.meta.properties) {
				Property prop = new Property();
				prop.meta = metaprop;
				rel.properties.add(prop);
			}
			*/
			this.metamodel.meta_diagram.meta_relations.add(rel);
			return rel;
		}
		return null;
	}
	
	private MetaObject findNode(Point2D p) {
    	for(MetaObject obj : this.metamodel.meta_diagram.meta_objects) {
    		Rectangle2D bound = new Rectangle2D(obj.pos.x, obj.pos.y, 60, 40);
    		if(bound.contains(p.getX(), p.getY())) {
    			return obj;
    		}
    	}
    	return null;
	}
	
	static MetaObject getObject(MetaDiagram d, int id) {
		for(MetaObject o : d.meta_objects) {
			if(o.id == id) return o;
		}
		return null;
	}
	
	static public MetaDiagram getMetaDiagram(int id) {
		if(metamodel.meta_diagram.id == id) {
			return metamodel.meta_diagram;
		}
		return null;
	}
	
	static public MetaObject getMetaObject(int id) {
		for(MetaObject obj : metamodel.meta_diagram.meta_objects) {
			if(obj.id == id) {
				return obj;
			}
		}
		return null;
	}
	
	static public MetaObject getMetaObject(int id, MetaDiagram meta_diagram) {
		for(MetaObject obj : meta_diagram.meta_objects) {
			if(obj.id == id) {
				return obj;
			}
		}
		return null;
	}
	
	static public MetaRelation getMetaRelationship(int id) {
		for(MetaRelation obj : metamodel.meta_diagram.meta_relations) {
			if(obj.id == id) {
				return obj;
			}
		}
		return null;
	}
	
	static public MetaProperty getMetaProperty(int id) {
		for(MetaObject obj : metamodel.meta_diagram.meta_objects) {
			for(MetaProperty metaprop : obj.properties) {
				if(id == metaprop.id) return metaprop;
			}
		}
		for(MetaRelation obj : metamodel.meta_diagram.meta_relations) {
			for(MetaProperty metaprop : obj.properties) {
				if(id == metaprop.id) return metaprop;
			}
		}
		return null;
	}
	
	public void saveRequest(int pid) {
		final DialogBox db = new DialogBox();
		db.setTitle("読み込み中");
		db.setText("読み込み中");
		db.show();
		db.center();
      	RequestGenerator.send("/cgi-bin/core/msave.cgi", "id="+pid+"&xml="+URL.encodeQueryString(XMLMetaPresenter.genModel(metamodel)), new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    			db.hide();
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			db.hide();
    			Console.log(response.getText());
//    			JSONObject jsonObject = JSONParser.parseLenient(response.getText()).isObject();
    		}});
    }
	
	public void loadRequest(int pid) {
		loadRequest(pid, null);
	}
	public void loadRequest(int pid, final LoadedListener listener) {
		final DialogBox db = new DialogBox();
		db.setTitle("読み込み中");
		db.setText("読み込み中");
		db.show();
		db.center();
      	RequestGenerator.send("/cgi-bin/core/mload.cgi", "id="+pid, new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    			Console.log(exception.getMessage());
    			db.hide();
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			Console.log(response.getText());
    			JSONObject jsonObject = JSONParser.parseLenient(response.getText()).isObject();
    	        JSONArray jsonArray;
    	        JSONString jsonString;
    	        JSONBoolean jsonBoolean;
    	        JSONNumber jsonNumber;
    	        
    	        int id = 0;
    	        String name = "";
    	        String xml = "";
    			if(jsonObject != null) {
    				
    				if((jsonNumber = jsonObject.get("id").isNumber()) != null) {
    					id = (int) jsonNumber.doubleValue();
    				}

    				if((jsonString = jsonObject.get("name").isString()) != null) {
    					name = jsonString.stringValue();
    				}
    				if((jsonString = jsonObject.get("xml").isString()) != null) {
    					xml = jsonString.stringValue();
    				}
    			}

    			metamodel = XMLMetaPresenter.parse(xml);
    			metamodel.id = id;
    			metamodel.name = name;
    			db.hide();
    			if(listener != null) listener.onLoaded();
    		}});
    }
	
	public void compile() {
		int x = 50;
		int y = 70;
		for(MetaObject obj : this.metamodel.meta_diagram.meta_objects) {
			this.transition(obj, x, y);
			x += obj.bound.width + 20;
		}
		compileMetaRelation();
	}
	
	private void compileMetaRelation() {
		MetaRelation r1 = null, r2 = null;
		for(MetaRelation meta_rel : this.metamodel.meta_diagram.meta_relations) {
			for(MetaRelation meta_rel2 : this.metamodel.meta_diagram.meta_relations) {
				if(meta_rel.id != meta_rel2.id && meta_rel.name.matches(meta_rel2.name)) {
					r1 = meta_rel;
					r2 = meta_rel2;
				}
			}
		}
		if(r1 != null && r2 != null) {
			r1.bindings.addAll(r2.bindings);
			this.metamodel.meta_diagram.meta_relations.remove(r2);
		}
	}
	
	public interface LoadedListener {
		public void onLoaded();
	}
}
