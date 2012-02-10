package com.clooca.core.client.gopprr.element;

import com.clooca.core.client.gopprr.metaelement.*;
import com.clooca.core.client.util.*;

public class Role extends ModelElement {
	
	NodeObject obj;
	
	public Role(MetaElement metaElem) {
		super(metaElem);
	}
	
	public NodeObject getObj() {
		return obj;
	}
	
	public void connect(NodeObject obj) {
		this.obj = obj;
	}

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
		// TODO Auto-generated method stub
		return null;
	}
}
