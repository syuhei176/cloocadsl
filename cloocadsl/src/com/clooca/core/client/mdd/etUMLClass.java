package com.clooca.core.client.mdd;

import java.util.HashMap;

import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.XMLParser;

public class etUMLClass {
	
	String name;
	String visibility;
	HashMap<String, etUMLProperty> properties = new HashMap<String, etUMLProperty>();
	HashMap<String, etUMLOperation> operations = new HashMap<String, etUMLOperation>();
	
	public etUMLClass() {
		
	}
	
	public etUMLClass(String xml) {
		fromXML(xml);
	}
	
	public etUMLClass(com.google.gwt.xml.client.Node node) {
		fromXML(node);
	}
	
	public void fromXML(String xml) {
		Document doc = XMLParser.parse(xml);
		NodeList nl = doc.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("Class")) {
				fromXML(nl.item(i));
			}
		}
	}
	
	public void fromXML(com.google.gwt.xml.client.Node node) {
		name = node.getAttributes().getNamedItem("name").getNodeValue();
		visibility = node.getAttributes().getNamedItem("visibility").getNodeValue();
		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("Property")) {
				etUMLProperty property = new etUMLProperty(nl.item(i));
				properties.put(property.getName(), property);
			}
			if(nl.item(i).getNodeName().matches("Operation")) {
				etUMLOperation operation = new etUMLOperation(nl.item(i));
				operations.put(operation.getName(), operation);
			}
			/*
			 * for previous version
			 */
			if(nl.item(i).getNodeName().matches("Method")) {
				etUMLOperation operation = new etUMLOperation(nl.item(i));
				operations.put(operation.getName(), operation);
			}

		}
	}
	
	public String toXML() {
		
		return null;
	}
}
