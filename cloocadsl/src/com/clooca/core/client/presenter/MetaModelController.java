package com.clooca.core.client.presenter;

import com.clooca.core.client.model.gopr.metaelement.Binding;
import com.clooca.core.client.model.gopr.metaelement.MetaDiagram;
import com.clooca.core.client.model.gopr.metaelement.MetaModel;
import com.clooca.core.client.model.gopr.metaelement.MetaObject;
import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
import com.clooca.core.client.model.gopr.metaelement.MetaRelation;
import com.clooca.core.client.presenter.XMLMetaPresenter;
import com.clooca.core.client.util.Point2D;
import com.clooca.core.client.util.Rectangle2D;
import com.clooca.webutil.client.Console;
import com.clooca.webutil.client.RequestGenerator;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.user.client.ui.DialogBox;

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
	
	
	public void loadRequest(int pid) {
		loadRequest(pid, null);
	}
	public void loadRequest(int pid, final LoadedListener listener) {
		final DialogBox db = new DialogBox();
		db.setTitle("読み込み中");
		db.setText("読み込み中");
		db.show();
		db.center();
      	RequestGenerator.send("/mload", "id="+pid, new RequestCallback(){

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
    	        String gen_prop = "";
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
    				if((jsonString = jsonObject.get("template").isString()) != null) {
    					gen_prop = jsonString.stringValue();
    				}
    			}
    			
    			metamodel = XMLMetaPresenter.parse(xml);
    			metamodel.id = id;
    			metamodel.name = name;
    			metamodel.gen_property = gen_prop;
    			db.hide();
    			if(listener != null) listener.onLoaded();
    		}});
    }
	
	public interface LoadedListener {
		public void onLoaded();
	}
	
}
