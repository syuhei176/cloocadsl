package com.clooca.core.client.mdd;


public class etUMLProperty {
	
	String name;
	String type;
	String visibility;
	
	public etUMLProperty() {
		
	}
	
	public etUMLProperty(com.google.gwt.xml.client.Node node) {
		fromXML(node);
	}
	
	public void fromXML(com.google.gwt.xml.client.Node node) {
		com.google.gwt.xml.client.Node prop_node = node;
		name = prop_node.getAttributes().getNamedItem("name").getNodeValue();
		type = prop_node.getAttributes().getNamedItem("type").getNodeValue();
		visibility = prop_node.getAttributes().getNamedItem("visibility").getNodeValue();
	}
	
	public String toXML() {
		String out = "";
		out += "<Property name=\""+name+"\" type=\""+type+"\" visibility=\""+visibility+"\">";
		out += "</Property>";
		return out;
	}
	
	public String getName() {
		return name;
	}
	
	public String toString() {
		return toXML();
	}
}
