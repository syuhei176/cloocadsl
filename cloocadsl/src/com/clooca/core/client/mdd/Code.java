package com.clooca.core.client.mdd;

import com.clooca.core.client.gui.Resource;


public class Code implements Resource{
	
	private String data;
	
	public Code() {
		setText(null);
	}

	public Code(String d) {
		setText(d);
	}

	public void setText(String text) {
		this.data = text;
	}

	public String getText() {
		return data;
	}

}
