package com.clooca.core.client.mdd;

import java.util.HashMap;

import com.google.gwt.xml.client.NodeList;

public class ExternalFunctions {
	
	private HashMap<String, etUMLOperation> functions = new HashMap<String, etUMLOperation>();

	public String toXML() {
		String out = "";
		return out;
	}
	
	public void fromXML(com.google.gwt.xml.client.Node node){
		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("ExternalEvent")) {
				com.google.gwt.xml.client.Node event_node = nl.item(i);
				String e = event_node.getAttributes().getNamedItem("event").getNodeValue();
				String t = event_node.getAttributes().getNamedItem("target").getNodeValue();
			}
		}
	}

	public HashMap<String, etUMLOperation> getHashMap() {
		return functions;
	}

}
