package com.clooca.core.client.diagram;

import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;

public class Property implements ChangeHandler {
 
	private String name;
	 
	private String content;
	 
	public Property() {
		
	}
	
	public Property(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}
	
	public String getContent() {
		return content;
	}
	                            
	@Override
	public void onChange(ChangeEvent event) {
		// TODO Auto-generated method stub
		
	}
	 
}
 
