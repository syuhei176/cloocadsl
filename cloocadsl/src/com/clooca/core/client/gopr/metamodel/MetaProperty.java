package com.clooca.core.client.gopr.metamodel;

import com.clooca.core.client.gopr.element.ModelElement;
import com.clooca.core.client.gopr.element.Property;

public class MetaProperty extends MetaElement {
	
	String name;
	String type;
	
	public MetaProperty(int id, String name, String type) {
		super(id);
		this.name = name;
		this.type = type;
	}
	
	public String getName() {
		return name;
	}
	
	public String getType() {
		return type;
	}

	@Override
	public ModelElement getInstance() {
		return new Property(this);
	}

}
