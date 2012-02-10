package com.clooca.core.client.gopprr.element;

import com.clooca.core.client.gopprr.metaelement.*;
import com.clooca.core.client.util.*;

public class Relationship extends ModelElement {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2123890117304060211L;
//	Binding parent;
	
	public Relationship(MetaElement metaitem) {
		super(metaitem);
//		this.parent = parent;
	}


	@Override
	public Object clone() {
		return new Relationship(this.metaElement);
	}
	
	@Override
	public void draw(GraphicManager gm) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public boolean contains(Point2D aPoint) {
		return false;
	}


	
}
