package com.clooca.core.client.mdd;

import com.google.gwt.xml.client.NodeList;
import com.clooca.core.client.gui.Resource;
import com.clooca.core.client.util.Converter;

public class etUMLAction implements Resource {
	
	String content;
	public etUMLAction() {
		content = "";
	}
	
	public etUMLAction(com.google.gwt.xml.client.Node node) {
		fromXML(node);
	}
	
	public void fromXML(com.google.gwt.xml.client.Node node) {
		com.google.gwt.xml.client.Node prop_node = node;
//		name = prop_node.getAttributes().getNamedItem("name").getNodeValue();
		NodeList nl = prop_node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeType() == com.google.gwt.xml.client.Node.TEXT_NODE) {
				String code = nl.item(i).getNodeValue();
				content = Converter.decode_action_language(code);
			}
		}
	}
	
	public String toXML() {
		if(content == null) return "";
		return "<Action>" + Converter.convert_action_language(content) + "</Action>";
	}
	
	public String getContent() {
		return this.content;
	}
	
	public void setContent(String content) {
		this.content = content;
	}

}
