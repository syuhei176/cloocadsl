package com.clooca.core.client.model.gopr.metaelement;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.clooca.core.client.model.gopr.element.Diagram;
import com.clooca.core.client.model.gopr.element.ModelElement;
import com.clooca.core.client.model.gopr.element.NodeObject;
import com.clooca.core.client.model.gopr.element.Relationship;
import com.clooca.core.client.model.gopr.element.VersionElement;
import com.clooca.core.client.model.gopr.metaelement.Binding;

public class MetaDiagram {
	public int id;
	public String name;
	public List<MetaObject> meta_objects = new ArrayList<MetaObject>();
	public List<MetaRelation> meta_relations = new ArrayList<MetaRelation>();
//	public List<Binding> bindings = new ArrayList<Binding>();
	public VersionElement ve = new VersionElement();
	
	public MetaDiagram() {
		
	}
	
	public void createSample() {
		/*
		 * MetaObjectの作成
		 */
		/*
		List<MetaProperty> properties0 = new ArrayList<MetaProperty>();
		properties0.add(new MetaProperty(0, "name", "text"));
		List<String> graphic_strings = new ArrayList<String>();
		graphic_strings.add("rect");
		graphic_strings.add("circle");
		graphic_strings.add("fillcircle");
		properties0.add(new MetaProperty(1, "graphic", "pulldown", graphic_strings));
		*/
//		MetaObject object = new MetaObject(0, "Object", false, "rect", 1, properties0);
//		meta_objects.add(object);
		/*
		 * Bindingの作成
		 */
//		Binding binding0 = new Binding(0, object, object);
//		this.bindings.add(binding0);
		
		/*
		 * MetaRelationshipの作成
		 */
		/*
		List<Binding> bind_list = new ArrayList<Binding>();
//		bind_list.add(binding0);
		List<MetaProperty> properties1 = new ArrayList<MetaProperty>();
		properties1.add(new MetaProperty(0, "name", "text"));
		MetaRelation relationship = new MetaRelation(0, "Relationship", bind_list, properties1);
		meta_relations.add(relationship);
		*/
	}
	
	public void UpdateMetaModel(Diagram diagram) {
		/*
		 * MetaObjectの作
		 */
		HashMap<String, MetaObject> objectmap = new HashMap<String, MetaObject>();
		for(NodeObject no : diagram.getNodeObjects()) {
			if(no.meta.id == 0) {
				String name = no.properties.get(0).getContent();
				String graphic = no.properties.get(1).getContent();
				List<MetaProperty> properties = new ArrayList<MetaProperty>();
				if(objectmap.containsKey("Object"+name)) {
					
				}else{
//					MetaObject object = new MetaObject(meta_objects.size(), "Object"+name, false, graphic, 1, properties);
//					meta_objects.add(object);
//					objectmap.put("Object"+name, object);
				}
			}
		}
		
		/*
		 * Bindingの作成
		 */
		HashMap<String, List<Binding>> relationtmap = new HashMap<String, List<Binding>>();
		for(Relationship r : diagram.getRelationships()) {
			/*
			Binding binding = new Binding(bindings.size(),
					objectmap.get("Object" + r.src.properties.get(0).getContent()),
					objectmap.get("Object" + r.dest.properties.get(0).getContent()));
			bindings.add(binding);
			*/
			String name = r.properties.get(0).getContent();
			if(relationtmap.containsKey(name)) {
//				relationtmap.get(name).add(binding);
			}else{
				relationtmap.put(name, new ArrayList<Binding>());
//				relationtmap.get(name).add(binding);
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
	/*
	public void load(JSONObject diagram) {
		JSONObject jsonObject;
        JSONString jsonString;
        JSONArray jsonArray;
        JSONNumber jsonNumber;
        
		if((jsonObject = diagram.get("diagram").isObject()) != null) {
			if((jsonString = jsonObject.get("name").isString()) != null) {
				name = (jsonString.stringValue());
			}
		}
		
		if((jsonArray = diagram.get("object").isArray()) != null) {
			for(int i=0;i < jsonArray.size();i++) {
				JSONObject jsonObject_obj;
	    		if((jsonObject_obj = jsonArray.get(i).isObject()) != null) {
	    			loadObject(jsonObject_obj);
	    		}
	    	}
		}
		
		if((jsonArray = diagram.get("relationship").isArray()) != null) {
			for(int i=0;i < jsonArray.size();i++) {
				JSONObject jsonObject_relations;
	    		if((jsonObject_relations = jsonArray.get(i).isObject()) != null) {
	    			loadRelationship(jsonObject_relations);
	    		}
	    	}
		}
		
	}
	
	private void loadObject(JSONObject jsonObject) {
        JSONString jsonString;
        JSONArray jsonArray;
        JSONNumber jsonNumber;
		int id = 0;
		String name = "no name";
		String graphic = "no graphic";
		if((jsonNumber = jsonObject.get("id").isNumber()) != null) {
			id = (int) jsonNumber.doubleValue();
		}
		if((jsonString = jsonObject.get("name").isString()) != null) {
			name = jsonString.stringValue();
		}
		if((jsonString = jsonObject.get("graphic").isString()) != null) {
			graphic = jsonString.stringValue();
		}
		List<MetaProperty> properties = new ArrayList<MetaProperty>();
		JSONArray jsonArray_property;
		if((jsonArray_property = jsonObject.get("property").isArray()) != null) {
			for(int j=0;j < jsonArray_property.size();j++) {
				JSONObject jsonObject_property;
				int prop_id = 0;
				String prop_name = null;
				String prop_type = null;
				List<String> prop_extend = new ArrayList<String>();
	    		if((jsonObject_property = jsonArray_property.get(j).isObject()) != null) {
        			if((jsonNumber = jsonObject_property.get("id").isNumber()) != null) {
        				prop_id = (int) jsonNumber.doubleValue();
        			}
        			if((jsonString = jsonObject_property.get("name").isString()) != null) {
        				prop_name = jsonString.stringValue();
        			}
        			if((jsonString = jsonObject_property.get("type").isString()) != null) {
        				prop_type = jsonString.stringValue();
       				}
        			if(prop_type.matches("pulldown")) {
            			JSONArray json_extend;
            			if((json_extend = jsonObject_property.get("extend").isArray()) != null) {
            				for(int i=0;i < json_extend.size();i++) {
                				prop_extend.add(json_extend.get(i).isString().stringValue());
                				GWT.log(prop_extend.get(i));
            				}
           				}
           				properties.add(new MetaProperty(prop_id, prop_name, prop_type, prop_extend));
        			}else{
           				properties.add(new MetaProperty(prop_id, prop_name, prop_type));
        			}
	    		}
			}
		}
		MetaObject object = new MetaObject(id, name, false, graphic, 1, properties);
		meta_objects.add(object);
	}
	
	private void loadRelationship(JSONObject jsonObject) {
        JSONString jsonString;
        JSONArray jsonArray;
        JSONNumber jsonNumber;
		int id = 0;
		String name = "no name";
		String arrow = "no graphic";
		if((jsonNumber = jsonObject.get("id").isNumber()) != null) {
			id = (int) jsonNumber.doubleValue();
		}
		if((jsonString = jsonObject.get("name").isString()) != null) {
			name = jsonString.stringValue();
		}
		if((jsonString = jsonObject.get("arrow").isString()) != null) {
			arrow = jsonString.stringValue();
		}
		
		List<Binding> bindings = new ArrayList<Binding>();
		JSONArray jsonArray_bindings;
		if((jsonArray_bindings = jsonObject.get("bindings").isArray()) != null) {
			for(int j=0;j < jsonArray_bindings.size();j++) {
				JSONObject jsonObject_binding;
				int src = 0;
				int dest = 0;
	    		if((jsonObject_binding = jsonArray_bindings.get(j).isObject()) != null) {
        			if((jsonNumber = jsonObject_binding.get("src").isNumber()) != null) {
        				src = (int) jsonNumber.doubleValue();
        			}
        			if((jsonNumber = jsonObject_binding.get("dest").isNumber()) != null) {
        				dest = (int) jsonNumber.doubleValue();
       				}
        			Binding binding = new Binding(0, getMetaObject(src), getMetaObject(dest));
        			bindings.add(binding);
	    		}
			}
		}
		
		List<MetaProperty> properties = new ArrayList<MetaProperty>();
		JSONArray jsonArray_property;
		if((jsonArray_property = jsonObject.get("property").isArray()) != null) {
			for(int j=0;j < jsonArray_property.size();j++) {
				JSONObject jsonObject_property;
				int prop_id = 0;
				String prop_name = null;
				String prop_type = null;
	    		if((jsonObject_property = jsonArray_property.get(j).isObject()) != null) {
        			if((jsonNumber = jsonObject_property.get("id").isNumber()) != null) {
        				prop_id = (int) jsonNumber.doubleValue();
        			}
        			if((jsonString = jsonObject_property.get("name").isString()) != null) {
        				prop_name = jsonString.stringValue();
        			}
        			if((jsonString = jsonObject_property.get("type").isString()) != null) {
        				prop_type = jsonString.stringValue();
       				}
       				properties.add(new MetaProperty(prop_id, prop_name, prop_type));
	    		}
			}
		}
		
		MetaRelation relationship = new MetaRelation(id, name, bindings, properties);
		meta_relations.add(relationship);
	}
	*/
	
	public String getName() {
		return name;
	}

	public List<MetaObject> getMetaObjects() {
		return meta_objects;
	}
	
	public MetaObject getMetaObject(int id) {
		for(MetaObject mo : meta_objects) {
			if(mo.id == id) {
				return mo;
			}
		}
		return null;
	}
	
	public MetaRelation getMetaRelation(int id) {
		for(MetaRelation mr : meta_relations) {
			if(mr.id == id) {
				return mr;
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
	
	
	/*
	public Diagram GetInstance(JSONObject json_diagram) {
		JSONObject jsonObject;
        JSONString jsonString;
        JSONArray jsonArray;
        JSONNumber jsonNumber;
        
        Diagram diagram = new Diagram(this);
      	if((jsonNumber = json_diagram.get("id").isNumber()) != null) {
      		diagram.setId((int) jsonNumber.doubleValue());
		}
		if((jsonNumber = json_diagram.get("metadiagram_id").isNumber()) != null) {
			
		}
		
		if((jsonArray = json_diagram.get("object").isArray()) != null) {
			for(int i=0;i < jsonArray.size();i++) {
				JSONObject jsonObject_obj;
	    		if((jsonObject_obj = jsonArray.get(i).isObject()) != null) {
	    			NodeObject no = loadModelObject(jsonObject_obj);
	    			diagram.addNodeAtPoint(no, no.getLocation());
	    		}
	    	}
		}
		
		if((jsonArray = json_diagram.get("relationship").isArray()) != null) {
			for(int i=0;i < jsonArray.size();i++) {
				JSONObject jsonObject_relations;
	    		if((jsonObject_relations = jsonArray.get(i).isObject()) != null) {
	    			loadModelRelationship(jsonObject_relations, diagram);
	    		}
	    	}
		}
		
		diagram.clearCommand();
		return diagram;
	}
	
	private NodeObject loadModelObject(JSONObject jsonObject) {
        JSONString jsonString;
        JSONArray jsonArray;
        JSONNumber jsonNumber;
		int id = 0;
		int metaobject_id = 0;
		int x = 0;
		int y = 0;
		int local_id = 0;
		if((jsonNumber = jsonObject.get("id").isNumber()) != null) {
			id = (int) jsonNumber.doubleValue();
		}
		if((jsonNumber = jsonObject.get("metaobject_id").isNumber()) != null) {
			metaobject_id = (int) jsonNumber.doubleValue();
		}
		if((jsonNumber = jsonObject.get("x").isNumber()) != null) {
			x = (int) jsonNumber.doubleValue();
		}
		if((jsonNumber = jsonObject.get("y").isNumber()) != null) {
			y = (int) jsonNumber.doubleValue();
		}
		if((jsonNumber = jsonObject.get("local_id").isNumber()) != null) {
			local_id = (int) jsonNumber.doubleValue();
		}
		
		NodeObject no = (NodeObject) getMetaObject(metaobject_id).getInstance();
		no.setId(id);
		no.setId(local_id);
		no.translate(x, y);
		
		List<MetaProperty> properties = new ArrayList<MetaProperty>();
		JSONArray jsonArray_property;
		if((jsonArray_property = jsonObject.get("properties").isArray()) != null) {
			for(int j=0;j < jsonArray_property.size();j++) {
				JSONObject jsonObject_property;
				int prop_id = 0;
				int meta_prop_id = 0;
				String prop_value = null;
	    		if((jsonObject_property = jsonArray_property.get(j).isObject()) != null) {
        			if((jsonNumber = jsonObject_property.get("id").isNumber()) != null) {
        				prop_id = (int) jsonNumber.doubleValue();
        			}
        			if((jsonNumber = jsonObject_property.get("metaproperty_id").isNumber()) != null) {
        				meta_prop_id = (int) jsonNumber.doubleValue();
        			}
        			if((jsonString = jsonObject_property.get("value").isString()) != null) {
        				prop_value = jsonString.stringValue();
        			}
	    		}
	    		no.getProperty().get(j).setContent(prop_value);
			}
		}
		return no;
	}
	
	private Relationship loadModelRelationship(JSONObject jsonObject, Diagram diagram) {
        JSONString jsonString;
        JSONArray jsonArray;
        JSONNumber jsonNumber;
		int id = 0;
		int metarelationship_id = 0;
		int x = 0;
		int y = 0;
		int local_id = 0;
		if((jsonNumber = jsonObject.get("id").isNumber()) != null) {
			id = (int) jsonNumber.doubleValue();
		}
		if((jsonNumber = jsonObject.get("metarelationship_id").isNumber()) != null) {
			metarelationship_id = (int) jsonNumber.doubleValue();
		}
		if((jsonNumber = jsonObject.get("src").isNumber()) != null) {
			x = (int) jsonNumber.doubleValue();
		}
		if((jsonNumber = jsonObject.get("dest").isNumber()) != null) {
			y = (int) jsonNumber.doubleValue();
		}
		if((jsonNumber = jsonObject.get("local_id").isNumber()) != null) {
			local_id = (int) jsonNumber.doubleValue();
		}
		*/
		/*
		List<MetaProperty> properties = new ArrayList<MetaProperty>();
		JSONArray jsonArray_property;
		if((jsonArray_property = jsonObject.get("property").isArray()) != null) {
			for(int j=0;j < jsonArray_property.size();j++) {
				JSONObject jsonObject_property;
				int prop_id = 0;
				String prop_name = null;
				String prop_type = null;
	    		if((jsonObject_property = jsonArray_property.get(j).isObject()) != null) {
        			if((jsonNumber = jsonObject_property.get("id").isNumber()) != null) {
        				prop_id = (int) jsonNumber.doubleValue();
        			}
        			if((jsonString = jsonObject_property.get("name").isString()) != null) {
        				prop_name = jsonString.stringValue();
        			}
        			if((jsonString = jsonObject_property.get("type").isString()) != null) {
        				prop_type = jsonString.stringValue();
       				}
       				properties.add(new MetaProperty(prop_id, prop_name, prop_type));
	    		}
			}
		}
		*/
	/*
		Relationship no = (Relationship) this.getMetaRelation(metarelationship_id).getInstance();
		no.setId(id);
		no.setId(local_id);
		diagram.addEdge(no, x, y);
		GWT.log("addedge"+local_id+","+x+","+y);
		return no;
	}
	*/
}
