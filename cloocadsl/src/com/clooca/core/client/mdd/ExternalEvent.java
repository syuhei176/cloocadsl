package com.clooca.core.client.mdd;

public class ExternalEvent {
	private String event_name;
	private String target_class;
	private Parameters params;

	public ExternalEvent() {
		params = new Parameters();
	}
	public ExternalEvent(String e, String t) {
		this.event_name = e;
		this.target_class = t;
		params = new Parameters();
	}
	
	public ExternalEvent(String e, String t, String p) {
		this.event_name = e;
		this.target_class = t;
		params = new Parameters();
		params.convert(p);
	}

	public ExternalEvent(String e, String t, Parameters p) {
		this.event_name = e;
		this.target_class = t;
		this.params = p;
	}
	
	public void setTarget_class(String target_class) {
		this.target_class = target_class;
	}
	public String getTarget_class() {
		return target_class;
	}
	public void setEvent_name(String event_name) {
		this.event_name = event_name;
	}
	public String getEvent_name() {
		return event_name;
	}
	
	public Parameters getParams() {
		return params;
	}
	
	public ExternalEvent(com.google.gwt.xml.client.Node node) {
		String e = node.getAttributes().getNamedItem("event").getNodeValue();
		String t = node.getAttributes().getNamedItem("target").getNodeValue();
		Parameters p = new Parameters();
		p.fromXML(node);
		this.setEvent_name(e);
		this.setTarget_class(t);
		this.params = p;
	}

	
}
