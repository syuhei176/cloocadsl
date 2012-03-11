package com.clooca.core.client.view;

import com.google.gwt.user.client.ui.Widget;

public abstract class AbstractEditor {
	
	Widget mainpanel;
	String name;
	String key;
	
	protected void initEditor(Widget w, String name, String key) {
		mainpanel = w;
		this.name = name;
		this.key = key;
	}
	
	public Widget getWidget() {
		return mainpanel;
	}

	public String getName() {
		return name;
	}

	public String getKey() {
		return key;
	}
}
