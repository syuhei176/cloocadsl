package com.clooca.core.client.mdd;

import java.util.HashMap;

import com.google.gwt.xml.client.NodeList;

public class etUMLOperation {
	private String name;
	private String out_param;
//	private Parameters params = new Parameters();
	HashMap<String, etUMLParameter> parameters = new HashMap<String, etUMLParameter>();
	private String visibility = "private";
	etUMLAction action = null;

	public etUMLOperation(String str) {
		this.str2t(str);
		action = new etUMLAction();
	}
	
	public etUMLOperation(String name, String out_param) {
		this.name = name;
		this.out_param = out_param;
		action = new etUMLAction();
	}
	
	public etUMLOperation(com.google.gwt.xml.client.Node node) {
		fromXML(node);
		if(action == null) {
			action = new etUMLAction();
		}
	}
	
	public void fromXML(com.google.gwt.xml.client.Node node) {
		com.google.gwt.xml.client.Node prop_node = node;
		name = prop_node.getAttributes().getNamedItem("name").getNodeValue();
		out_param = prop_node.getAttributes().getNamedItem("out_param").getNodeValue();
		visibility = prop_node.getAttributes().getNamedItem("visibility").getNodeValue();
		NodeList nl = prop_node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("Parameter")) {
				etUMLParameter param = new etUMLParameter(nl.item(i));
				parameters.put(param.getName(), param);
			}else if(nl.item(i).getNodeName().matches("Action")) {
				action = new etUMLAction(nl.item(i));
			}
		}
	}
	
	public String toXML() {
		String out = "";
		out += "<Operation name=\"" + name + "\" visibility=\"" + visibility + "\" out_param=\""+out_param+"\">";
		out += "<Parameter name=\"return\" kind=\"output\" type=\"" + out_param + "\"></Parameter>";
		for(String key : parameters.keySet()) {
			out += parameters.get(key).toXML();
		}
		out += action.toXML();
		out += "</Operation>";
		return out;
	}
	
	static etUMLOperation str2op(String attr) {
		etUMLOperation op = new etUMLOperation("", "");
		op.str2t(attr);
		return op;
	}
	
	public void str2t(String attr) { 
		//"(+|-)<name>():<type>"
		//"[\\+\\-]\\w\\((|\\w:\\w,(\\w:\\w)*\\)):\\w"
		// && attr.matches("[\\+\\-]\\w\\(\\):\\w")
		if(attr != null) {
			if(attr.charAt(0) == '+') visibility = "public";
			if(attr.charAt(0) == '-') visibility = "private";
			String[] s = attr.split(":");
			name = s[0].substring(1);
			out_param = s[1];
			/*
			String[] s = attr.split("(");
			name = s[0].substring(1);
			int i = s[1].lastIndexOf(':');
			out_param = s[1].substring(i+1);
			{
				String params = s[1].substring(0, i-2);
				String[] str = params.split(",");
				for(String p : str) {
					if(p.matches("\\w\\w*:\\w\\w*")) {
						parameters.put(p.split(":")[0], new etUMLParameter(p.split(":")[0], p.split(":")[1]));
					}
				}
			}*/
		}
	}
	
	public String t2str() { 
		//"(+|-)<name>:<type>"
		String out = "";
		if(visibility.matches("public")) out += "+";
		else out += "-";
		out += name + ":";
		/*
		for(String key : parameters.keySet()) {
			out += key + ":" + parameters.get(key).getType() + ",";
		}
		out += "):";
		*/
		out += out_param;
		return out;
	}

	
	public String toExeXML() {
		String out = "";
		out += "<Operation name=\"" + name + "\" visibility=\"" + visibility + "\">";
		out += "<Parameter name=\"return\" kind=\"output\" type=\"" + out_param + "\"></Parameter>";
		for(String key : parameters.keySet()) {
			out += parameters.get(key).toXML();
		}
		out += action.toXML();
		out += "</Operation>";
		return out;
	}
	
	public String getName() {
		return name;
	}
	
	public etUMLAction getAction() {
		return action;
	}
	
	public String toString() {
		return toXML();
	}
	
}
