package com.clooca.core.client.gopprr.metaelement;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.clooca.core.client.gopprr.element.*;
import com.clooca.webutil.client.RequestGenerator;

public class MetaDiagram extends MetaElement {
	String name;
	List<MetaObject> meta_objects = new ArrayList<MetaObject>();
	List<MetaRelation> meta_relations = new ArrayList<MetaRelation>();
	List<MetaRole> meta_roles = new ArrayList<MetaRole>();
	List<MetaBinding> meta_bindings = new ArrayList<MetaBinding>();
	
	public MetaDiagram(int id) {
		super(id);
		load(id);
	}
	
	public void createSample() {
		/*
		 * MetaObjectの作成
		 */
		MetaObject state = new MetaObject(0, "state", false,"rect", 1);
		MetaObject startstate = new MetaObject(1, "startstate", false, "circle", 1);
		MetaObject endstate = new MetaObject(2, "endstate", false, "circle", 1);
		meta_objects.add(state);
		meta_objects.add(startstate);
		meta_objects.add(endstate);
		/*
		 * MetaRelationshipの作成
		 */
		MetaRelation transition = new MetaRelation(0, "transition");
		meta_relations.add(transition);
		MetaRole from = new MetaRole(0, "from", state);
		MetaRole to = new MetaRole(1, "to", state);
		MetaRole s_from = new MetaRole(2, "from", startstate);
		MetaRole to_e = new MetaRole(3, "to", endstate);
		meta_roles.add(from);
		meta_roles.add(to);
		meta_roles.add(s_from);
		meta_roles.add(to_e);
		{
			List<MetaRole> roles = new ArrayList<MetaRole>();
			roles.add(from);
			roles.add(to);
			meta_bindings.add(new MetaBinding(this, 0, transition, roles));
		}
		{
			List<MetaRole> roles = new ArrayList<MetaRole>();
			roles.add(from);
			roles.add(to_e);
			meta_bindings.add(new MetaBinding(this, 1, transition, roles));
		}
		{
			List<MetaRole> roles = new ArrayList<MetaRole>();
			roles.add(s_from);
			roles.add(to);
			meta_bindings.add(new MetaBinding(this, 2, transition, roles));
		}
	}
	
	public void load(int id) {
      	RequestGenerator.send("/cgi-bin/core/metadiagram.cgi", "id="+id, new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			JSONObject jsonObject = JSONParser.parseLenient(response.getText()).isObject();
    	        JSONString jsonString;
    	        JSONArray jsonArray;
    	        JSONNumber jsonNumber;
    	        
    			if((jsonObject = jsonObject.isObject()) != null) {
    				
    				if((jsonString = jsonObject.get("name").isString()) != null) {
    					name = (jsonString.stringValue());
    				}
    				
    				if((jsonArray = jsonObject.get("objs").isArray()) != null) {
    					for(int i=0;i < jsonArray.size();i++) {
            				if((jsonNumber = jsonArray.get(i).isNumber()) != null) {
            					int obj_id = (int) jsonNumber.doubleValue();
            					meta_objects.add(new MetaObject(obj_id));
            				}
    					}
    				}
    				
    				if((jsonArray = jsonObject.get("relations").isArray()) != null) {
    					for(int i=0;i < jsonArray.size();i++) {
            				if((jsonNumber = jsonArray.get(i).isNumber()) != null) {
            					int obj_id = (int) jsonNumber.doubleValue();
            					meta_relations.add(new MetaRelation(obj_id));
            				}
    					}
    				}
    				
    				if((jsonArray = jsonObject.get("roles").isArray()) != null) {
    					for(int i=0;i < jsonArray.size();i++) {
            				if((jsonNumber = jsonArray.get(i).isNumber()) != null) {
            					int obj_id = (int) jsonNumber.doubleValue();
            					meta_roles.add(new MetaRole(obj_id, MetaDiagram.this));
            				}
    					}
    				}
    				
    				if((jsonArray = jsonObject.get("bindings").isArray()) != null) {
    					for(int i=0;i < jsonArray.size();i++) {
            				if((jsonNumber = jsonArray.get(i).isNumber()) != null) {
            					int binding_id = (int) jsonNumber.doubleValue();
            					meta_bindings.add(new MetaBinding(MetaDiagram.this, binding_id));
            				}
    					}

    				}
    				
    			}

    		}});

	}
	
	public String getName() {
		return name;
	}

	public List<MetaObject> getMetaObjects() {
		return meta_objects;
	}
	
	public MetaObject getMetaObject(int id) {
		for(MetaObject mo : meta_objects) {
			if(mo.getId() == id) {
				return mo;
			}
		}
		return null;
	}
	
	public MetaRelation getMetaRelation(int id) {
		for(MetaRelation mr : meta_relations) {
			if(mr.getId() == id) {
				return mr;
			}
		}
		return null;
	}
	
	public MetaRole getMetaRole(int id) {
		for(MetaRole mr : meta_roles) {
			if(mr.getId() == id) {
				return mr;
			}
		}
		return null;
	}
	
	public List<MetaRelation> getMetaRelations() {
		return meta_relations;
	}
	
	public List<MetaRole> getMetaRoles() {
		return meta_roles;
	}
	
	public List<MetaBinding> getMetaBindings() {
		return meta_bindings;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public List<MetaObject> getObjectTool() {
		List<MetaObject> elements = new ArrayList<MetaObject>();
		for(MetaObject mi : meta_objects) {
			if(mi.getInstance() != null) {
				elements.add(mi);
			}
		}
		return elements;
	}
	
	public List<MetaRelation> getRelationshipTool() {
		List<MetaRelation> elements = new ArrayList<MetaRelation>();
		for(MetaRelation mi : meta_relations) {
			if(mi.getInstance() != null) {
				elements.add(mi);
			}
		}
		return elements;
	}
	
	@Override
	public ModelElement getInstance() {
		return new Diagram(this);
	}

}
