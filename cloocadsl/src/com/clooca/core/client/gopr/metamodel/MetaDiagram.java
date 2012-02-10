package com.clooca.core.client.gopr.metamodel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.clooca.core.client.gopr.element.*;
import com.clooca.core.client.gopr.metamodel.Binding;
import com.clooca.webutil.client.RequestGenerator;

public class MetaDiagram extends MetaElement {
	String name;
	List<MetaObject> meta_objects = new ArrayList<MetaObject>();
	List<MetaRelation> meta_relations = new ArrayList<MetaRelation>();
	List<Binding> bindings = new ArrayList<Binding>();
	
	public MetaDiagram(int id) {
		super(id);
		load(id);
	}
	
	public void createSample() {
		/*
		 * MetaObjectの作成
		 */
		List<MetaProperty> properties0 = new ArrayList<MetaProperty>();
		properties0.add(new MetaProperty(0, "name", "text"));
		List<String> graphic_strings = new ArrayList<String>();
		graphic_strings.add("rect");
		graphic_strings.add("circle");
		graphic_strings.add("fillcircle");
		properties0.add(new MetaProperty(1, "graphic", "pulldown", graphic_strings));
		MetaObject object = new MetaObject(0, "Object", false, "rect", 1, properties0);
		meta_objects.add(object);
		/*
		 * Bindingの作成
		 */
		Binding binding0 = new Binding(0, object, object);
		this.bindings.add(binding0);
		
		/*
		 * MetaRelationshipの作成
		 */
		List<Binding> bind_list = new ArrayList<Binding>();
		bind_list.add(binding0);
		List<MetaProperty> properties1 = new ArrayList<MetaProperty>();
		properties1.add(new MetaProperty(0, "name", "text"));
		MetaRelation relationship = new MetaRelation(0, "Relationship", bind_list, properties1);
		meta_relations.add(relationship);
	}
	
	public void UpdateMetaModel(Diagram diagram) {
		/*
		 * MetaObjectの作成
		 */
		HashMap<String, MetaObject> objectmap = new HashMap<String, MetaObject>();
		for(NodeObject no : diagram.getNodeObjects()) {
			if(no.getMetaElement().getId() == 0) {
				String name = no.getProperty().get(0).getContent();
				String graphic = no.getProperty().get(1).getContent();
				List<MetaProperty> properties = new ArrayList<MetaProperty>();
				if(objectmap.containsKey("Object"+name)) {
					
				}else{
					MetaObject object = new MetaObject(meta_objects.size(), "Object"+name, false, graphic, 1, properties);
					meta_objects.add(object);
					objectmap.put("Object"+name, object);
				}
			}
		}
		
		/*
		 * Bindingの作成
		 */
		HashMap<String, List<Binding>> relationtmap = new HashMap<String, List<Binding>>();
		for(Relationship r : diagram.getRelationships()) {
			Binding binding = new Binding(bindings.size(),
					objectmap.get("Object" + r.getSrc().getProperty().get(0).getContent()),
					objectmap.get("Object" + r.getDest().getProperty().get(0).getContent()));
			bindings.add(binding);
			String name = r.getProperty().get(0).getContent();
			if(relationtmap.containsKey(name)) {
				relationtmap.get(name).add(binding);
			}else{
				relationtmap.put(name, new ArrayList<Binding>());
				relationtmap.get(name).add(binding);
			}
		}
		
		/*
		 * MetaRelationshipの作成
		 */
		for(String name : relationtmap.keySet()) {
			MetaRelation relationship = new MetaRelation(meta_relations.size(), name, relationtmap.get(name), new ArrayList<MetaProperty>());
			meta_relations.add(relationship);
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
    						JSONObject jsonObject_obj;
    		    			if((jsonObject_obj = jsonArray.get(i).isObject()) != null) {
    		    				int id = 0;
        						String name = "no name";
        						String graphic = "no graphic";
                				if((jsonNumber = jsonObject_obj.get("id").isNumber()) != null) {
                					id = (int) jsonNumber.doubleValue();
                				}
                				if((jsonString = jsonObject_obj.get("name").isString()) != null) {
                					name = jsonString.stringValue();
                				}
                				if((jsonString = jsonObject_obj.get("graphic").isString()) != null) {
                					graphic = jsonString.stringValue();
                				}
                				List<MetaProperty> properties = new ArrayList<MetaProperty>();
                				/*
                				properties0.add(new MetaProperty(0, "name", "text"));
                				properties0.add(new MetaProperty(1, "graphic", "text"));
                				*/
                				MetaObject object = new MetaObject(id, name, false, graphic, 1, properties);
                				meta_objects.add(object);
    		    			}
    					}
    				}
    				
    				/*
    				if((jsonArray = jsonObject.get("relations").isArray()) != null) {
    					for(int i=0;i < jsonArray.size();i++) {
            				if((jsonNumber = jsonArray.get(i).isNumber()) != null) {
            					int obj_id = (int) jsonNumber.doubleValue();
            					meta_relations.add(new MetaRelation(obj_id, MetaDiagram.this));
            				}
    					}
    				}
    				
    				if((jsonArray = jsonObject.get("bindings").isArray()) != null) {
    					for(int i=0;i < jsonArray.size();i++) {
            				if((jsonNumber = jsonArray.get(i).isNumber()) != null) {
            					int obj_id = (int) jsonNumber.doubleValue();
            					bindings.add(new Binding(obj_id, MetaDiagram.this));
            				}
    					}
    				}
    				*/
    				
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
	
	public Binding getBinding(int id) {
		for(Binding b : bindings) {
			if(b.getId() == id) {
				return b;
			}
		}
		return null;
	}

	
	public List<MetaRelation> getMetaRelations() {
		return meta_relations;
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
