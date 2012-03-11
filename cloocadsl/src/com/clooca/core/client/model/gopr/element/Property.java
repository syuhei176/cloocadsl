package com.clooca.core.client.model.gopr.element;

import com.clooca.core.client.model.gopr.metaelement.MetaProperty;

public class Property {
	
	public MetaProperty meta;
	public int id;
	public String content ="";
	public VersionElement ve = new VersionElement();
	
	public Property() {
		
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = 3523901870729032042L;
	
	public String getContent() {
		return content;
	}
	
	public void setContent(String content) {
		this.content = content;
	}
	
}
