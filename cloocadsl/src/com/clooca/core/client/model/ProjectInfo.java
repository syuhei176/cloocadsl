package com.clooca.core.client.model;

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
	long owner_id;
	String owner_name;
	String projectname;
	String xml;
	String type;
	long belonglesson;
	
	
	public ProjectInfo(JSONValue jsonvalue) {
        JSONArray jsonArray;
        JSONObject jsonObject;
        JSONString jsonString;
        JSONBoolean jsonBoolean;
        JSONNumber jsonNumber;
		this.projectname = "";
		this.xml = "";
		this.belonglesson = 0;
		this.type = "uml";
        
		if((jsonObject = jsonvalue.isObject()) != null) {
			
			if((jsonNumber = jsonObject.get("id").isNumber()) != null) {
				id = (long) (jsonNumber.doubleValue());
			}

			if((jsonString = jsonObject.get("projectname").isString()) != null) {
				projectname = (jsonString.stringValue());
			}
			/*
			if((jsonNumber = jsonObject.get("owner_id").isNumber()) != null) {
				owner_id = (long) (jsonNumber.doubleValue());
			}
			*/
			if(jsonObject.containsKey("owner_name")) {
				if((jsonString = jsonObject.get("owner_name").isString()) != null) {
					owner_name = (jsonString.stringValue());
				}
			}
			if(jsonObject.containsKey("xml")) {
				if((jsonString = jsonObject.get("xml").isString()) != null) {
					xml = (jsonString.stringValue());
				}
			}else{
				xml = "null";
			}
			if(jsonObject.containsKey("belonglesson")) {
				if((jsonNumber = jsonObject.get("belonglesson").isNumber()) != null) {
					belonglesson = (long)(jsonNumber.doubleValue());
				}else{
					
				}
			}else{
				
			}
			if(jsonObject.containsKey("type")) {
				if((jsonString = jsonObject.get("type").isString()) != null) {
					type = (jsonString.stringValue());
				}
			}
		}
	}
	
	public long getId() {
		return this.id;
	}
	
	public long getOwnerId() {
		return this.id;
	}
	
	public String getOwnerName() {
		return this.owner_name;
	}
	
	public String getProjectname() {
		return this.projectname;
	}
	
	public String getXML() {
		return this.xml;
	}
	
	public String getType() {
		return this.type;
	}
	
	public long getBelongLesson() {
		return this.belonglesson;
	}
	
	public class ProjectDetail {
		
		private String numofclass;
		
		public ProjectDetail() {
			
		}
		
		public void fromXML(String xml) {
			Document doc = XMLParser.parse(xml);
			NodeList nl = doc.getChildNodes();
			for(int i = 0;i < nl.getLength();i++) {
				if(nl.item(i).getNodeName().matches("Detail")) {
					parseDetail(nl.item(i));
				}
			}

		}
		
		private void parseDetail(Node node) {
			NodeList nl = node.getChildNodes();
			for(int i = 0;i < nl.getLength();i++) {
				if(nl.item(i).getNodeName().matches("Belong")) {
					NodeList nl2 = nl.item(i).getChildNodes();
					for(int ii = 0;ii < nl2.getLength();ii++) {
						if(nl2.item(ii).getNodeType() == com.google.gwt.xml.client.Node.TEXT_NODE) {
//							this.belong = nl2.item(ii).getNodeValue();
						}
					}

				}
			}

		}
		
		public String toXML() {
			String detail = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
			detail += "<Detail>";
//			detail += "<Belong>"+this.belong+"</Belong>";
			detail += "</Detail>";
			return detail;
		}
		
		public void setBelong(String belong) {
//			this.belong = belong;
		}
		
		public String getBelong() {
			return "";
		}
	}

}
