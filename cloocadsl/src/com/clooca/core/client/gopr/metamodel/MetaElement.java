package com.clooca.core.client.gopr.metamodel;

import com.clooca.core.client.gopr.element.ModelElement;

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
