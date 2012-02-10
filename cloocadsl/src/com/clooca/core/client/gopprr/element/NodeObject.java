package com.clooca.core.client.gopprr.element;

import com.clooca.core.client.diagram.shape.IShape;
import com.clooca.core.client.gopprr.metaelement.*;
import com.clooca.core.client.util.*;

public class NodeObject extends ModelElement {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2123890117304060211L;
	
	IShape shape;
	Rectangle2D bound;
	
	public NodeObject(MetaElement metaitem, IShape shape) {
		super(metaitem);
		this.shape = shape;
		bound = new Rectangle2D(0,0,50,50);
	}

	public Object clone() {
		return new NodeObject(this.metaElement, shape);
	}
	
	@Override
	public void draw(GraphicManager gm) {
		gm.setColor(color);
		shape.draw(gm, bound);
	}

	@Override
	public boolean contains(Point2D aPoint) {
		return bound.contains(aPoint.getX(), aPoint.getY());
	}
	
	public void translate(double dx, double dy) {
		bound.x += dx;
		bound.y += dy;
	}
	
	public Point2D getLocation() {
		return new Point2D(bound.getX(), bound.getY());
	}

	public Rectangle2D getBounds() {
		return bound;
	}
	
}
