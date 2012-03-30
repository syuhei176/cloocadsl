package com.clooca.core.client.presenter;

import com.clooca.core.client.model.gopr.element.Diagram;
import com.clooca.core.client.model.gopr.element.Model;
import com.clooca.core.client.model.gopr.element.NodeObject;
import com.clooca.core.client.model.gopr.element.Property;
import com.clooca.core.client.model.gopr.element.Relationship;
import com.clooca.core.client.model.gopr.metaelement.Binding;
import com.clooca.core.client.model.gopr.metaelement.MetaDiagram;
import com.clooca.core.client.model.gopr.metaelement.MetaModel;
import com.clooca.core.client.model.gopr.metaelement.MetaObject;
import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
import com.clooca.core.client.model.gopr.metaelement.MetaRelation;
import com.clooca.core.client.util.IdGenerator;
import com.clooca.core.client.util.Point2D;
import com.clooca.webutil.client.RequestGenerator;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.http.client.URL;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.user.client.Window;

public class ModelController {
	
	static Model model;
	
	public ModelController() {
		
	}
	
	/*
	private void create_new_model() {
		model = new Model();
		model.id = 1;
		model.root = new Diagram();
		model.root.meta = metamodel.meta_diagram;
		
		NodeObject obj1 = addObject(new Point2D(100, 100));
		NodeObject obj2 = addObject(new Point2D(100, 220));
		Relationship rel = new Relationship();
		rel.id = 2;
		rel.meta = model.root.meta.meta_relations.get(0);
		rel.src = obj1;
		rel.dest = obj2;
		model.root.relationships.add(rel);
	}
	*/
	
	/*
	private NodeObject addObject(Point2D pos) {
		NodeObject obj = new NodeObject();
		obj.id = IdGenerator.getNewLongId();
		obj.meta = model.root.meta.meta_objects.get(0);
		obj.pos = pos;
		for(MetaProperty metaprop : obj.meta.properties) {
			Property prop = new Property();
			prop.meta = metaprop;
			obj.properties.add(prop);
		}
		model.root.nodes.add(obj);
		return obj;
	}
	*/
	
	public Model getModel() {
		return model;
	}
	
	static public NodeObject getObject(int id) {
		for(NodeObject obj : model.getRootDiagram().nodes) {
			if(obj.id == id) {
				return obj;
			}
		}
		return null;
	}
	

	/*
	public void sendCommand(int pid) {
      	RequestGenerator.send("/cgi-bin/core/save.cgi", "pid="+pid+"&command="+command_list.getXML(), new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			Window.alert(response.getText());
    			JSONObject jsonObject = JSONParser.parseLenient(response.getText()).isObject();
    			JSONArray jsonArray = jsonObject.get("object_ids").isArray();
    			for(int i=0;i < jsonArray.size();i++) {
    				JSONObject json_objectid;
    				json_objectid = jsonArray.get(i).isObject();
    				int local_id = (int) json_objectid.get("local_id").isNumber().doubleValue();
    				int global_id = (int) json_objectid.get("global_id").isNumber().doubleValue();
    				findNode(local_id).setId(global_id);
    			}
    			command_list.clear();
    		}});
	}
	*/

}
