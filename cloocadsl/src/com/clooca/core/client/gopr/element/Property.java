package com.clooca.core.client.gopr.element;

import com.clooca.core.client.gopr.metamodel.MetaElement;
import com.clooca.core.client.util.GraphicManager;
import com.clooca.core.client.util.Point2D;

public class Property extends ModelElement {
	
	String content;
	
	public Property(MetaElement metaElement) {
		super(metaElement);
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = 3523901870729032042L;

	@Override
	public void draw(GraphicManager gm) {
		// TODO Auto-generated method stub

	}

	@Override
	public boolean contains(Point2D aPoint) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Object clone() {
		return new Property(super.metaElement);
	}
	
	public String getContent() {
		return content;
	}
	
	public void setContent(String content) {
		this.content = content;
	}
	
}
