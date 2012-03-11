package com.clooca.core.client.model;

import com.clooca.core.client.model.gopr.element.Model;
import com.clooca.core.client.model.gopr.metaelement.MetaModel;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.XMLParser;

public class ProjectInfo {
	long id;
	String name;
	String xml;
	public Model model;
	int model_id;
	int metamodel_id;
	
	public ProjectInfo(JSONValue jsonvalue) {
        JSONArray jsonArray;
        JSONObject jsonObject;
        JSONString jsonString;
        JSONBoolean jsonBoolean;
        JSONNumber jsonNumber;
        
		if((jsonObject = jsonvalue.isObject()) != null) {
			
			if((jsonNumber = jsonObject.get("id").isNumber()) != null) {
				id = (long) (jsonNumber.doubleValue());
			}

			if((jsonString = jsonObject.get("name").isString()) != null) {
				name = (jsonString.stringValue());
			}
			if((jsonString = jsonObject.get("xml").isString()) != null) {
				xml = (jsonString.stringValue());
			}
			if(jsonObject.containsKey("metamodel_id")) {
				if((jsonNumber = jsonObject.get("metamodel_id").isNumber()) != null) {
					metamodel_id = (int) jsonNumber.doubleValue();
				}
			}
		}
	}


	public long getId() {
		return id;
	}


	public String getName() {
		return name;
	}


	public String getXml() {
		return xml;
	}
	
	public int getMetaModelId() {
		return this.metamodel_id;
	}
}
