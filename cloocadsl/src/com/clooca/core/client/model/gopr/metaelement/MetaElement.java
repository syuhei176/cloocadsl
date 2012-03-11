package com.clooca.core.client.model.gopr.metaelement;

import com.clooca.core.client.model.gopr.element.ModelElement;

abstract public class MetaElement {
	
	int id;
	
	public MetaElement(int id) {
		this.id = id;
	}
	
	public int getId() {
		return id;
	}
	
	abstract public ModelElement getInstance();
}
