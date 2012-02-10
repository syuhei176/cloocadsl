package com.clooca.core.client.mdd;

import java.util.ArrayList;

import com.google.gwt.xml.client.NodeList;

public class Parameters {
	
	private ArrayList<Parameter> params = new ArrayList<Parameter>();
	
	public class Parameter {
		
		private String name, type;
		
		public Parameter(String name, String type) {
			this.name = name;
			this.type = type;
		}
		
		public Parameter(com.google.gwt.xml.client.Node node) {
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
	}
	
	public Parameters() {
		
	}

	public Parameters(String text) {
		convert(text);
	}

	public void convert(String text) {
		params.clear();
		if(text != null && text.length() >= 3) {
			String[] str = text.split(",");
			for(String s : str) {
				if(s.matches("\\w\\w*:\\w\\w*")) {
					params.add(new Parameter(s.split(":")[0], s.split(":")[1]));
				}
			}
		}

	}
	
	public String convertToString() {
		String str = "";
		for(int i = 0;i < params.size();i++) {
			str += params.get(i).getName() + ":" + params.get(i).getType();
			if(params.size() - 1 != i) str += ",";
		}
		return str;
	}
	
	public String toXML() {
		String out = "";
		for(Parameter p : params) {
			out += "<Parameter name=\"" + p.getName() + "\" kind=\"input\" type=\"" + p.getType() + "\"></Parameter>";			
		}
		return out;
	}

	public void fromXML(com.google.gwt.xml.client.Node node) {
//		StatusTabPanel.WriteStatus(StatusTabPanel.LogLevel.INFO, "Parameters");
		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("Parameter")) {
				com.google.gwt.xml.client.Node param_node = nl.item(i);
				String attrs_name = param_node.getAttributes().getNamedItem("name").getNodeValue();
				String attrs_type = param_node.getAttributes().getNamedItem("type").getNodeValue();
				params.add(new Parameter(param_node));
			}
		}
	}
		
}
