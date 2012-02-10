package com.clooca.core.client.mdd;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.xml.client.NodeList;
import com.clooca.core.client.gui.Resource;
import com.clooca.core.client.util.Converter;

public class ExternalEvents implements Resource {
	
//	private ArrayList<ExternalEvent> events = new ArrayList<ExternalEvent>();
	private HashMap<String, ExternalEvent> events = new HashMap<String, ExternalEvent>();
	
	public ExternalEvents() {
		
	}
	
	public void add(ExternalEvent event) {
		events.put(event.getEvent_name(), event);
	}
	
	public void remove(String key) {
		events.remove(key);
	}
	
	public String toXML() {
		if(events.size() == 0) return "";
		String out = "";
		out += "<ExternalEvents>";
		for(String key : this.events.keySet()) {
			out += "<ExternalEvent event=\""+events.get(key).getEvent_name()+"\" target=\""+events.get(key).getTarget_class()+"\">";
			out += events.get(key).getParams().toXML();
			out += "</ExternalEvent>";
		}
		out += "</ExternalEvents>";
		return out;
	}

	public String toExeXML() {
		if(events.size() == 0) return "";
		String out = "";
		out += "<ExternalEvents>";
		for(String key : this.events.keySet()) {
			out += "<ExternalEvent event=\""+events.get(key).getEvent_name()+"\" target=\""+Converter.convert(events.get(key).getTarget_class())+"\">";
			out += events.get(key).getParams().toXML();
			out += "</ExternalEvent>";
		}
		out += "</ExternalEvents>";
		return out;
	}

	public void fromXML(com.google.gwt.xml.client.Node node){
		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("ExternalEvent")) {
//				StatusTabPanel.WriteStatus(StatusTabPanel.LogLevel.INFO, "ExternalEvent");
				com.google.gwt.xml.client.Node event_node = nl.item(i);
				add(new ExternalEvent(event_node));
			}
		}
	}

	public HashMap<String, ExternalEvent> getHashMap() {
		return events;
	}
	
	public Object[] toEventNameArray() {
		ArrayList<String> EventNameArray = new ArrayList<String>();
		for(String key : events.keySet()) {
			EventNameArray.add(events.get(key).getEvent_name());
		}
		return EventNameArray.toArray();
	}
}
