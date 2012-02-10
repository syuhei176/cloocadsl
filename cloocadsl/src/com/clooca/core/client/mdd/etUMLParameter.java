package com.clooca.core.client.mdd;

public class etUMLParameter {
	
	private String name, type;
	
	public etUMLParameter(String name, String type) {
		this.name = name;
		this.type = type;
	}
	
	public etUMLParameter(com.google.gwt.xml.client.Node node) {
		name = node.getAttributes().getNamedItem("name").getNodeValue();
		type = node.getAttributes().getNamedItem("type").getNodeValue();
	}

	
	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}
	
	public String toXML() {
		return "<Parameter name=\""+name+"\" type=\""+type+"\"></Parameter>";
	}
	
}
