package com.clooca.core.client.gopr.metamodel;

import java.util.List;

import com.clooca.core.client.gopr.element.ModelElement;
import com.clooca.core.client.gopr.element.Property;

public class MetaProperty extends MetaElement {
	
	String name;
	String type;
	List<String> strings;
	
	public MetaProperty(int id, String name, String type) {
		super(id);
		this.name = name;
		this.type = type;
	}
	
	public MetaProperty(int id, String name, String type, List<String> strings) {
		super(id);
		this.name = name;
		this.type = type;
		this.strings = strings;
	}
	
	public String getName() {
		return name;
	}
	
	public String getType() {
		return type;
	}
	
	public List<String> getPullDownList() {
		return strings;
	}

	@Override
	public ModelElement getInstance() {
		return new Property(this);
	}

}
