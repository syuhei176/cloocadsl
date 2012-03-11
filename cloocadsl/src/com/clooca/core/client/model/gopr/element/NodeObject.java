package com.clooca.core.client.model.gopr.element;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.model.gopr.metaelement.MetaObject;
import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
import com.clooca.core.client.util.*;

public class NodeObject {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2123890117304060211L;
	
	public int id;
	public MetaObject meta;
	public Point2D pos = new Point2D();
	public Rectangle2D bound;
	
//	IShape shape;
//	Rectangle2D bound;
	public List<Property> properties = new ArrayList<Property>();
	public VersionElement ve = new VersionElement();
	
	public NodeObject() {
		bound = new Rectangle2D();
	}
	/*
	public NodeObject(MetaObject metaitem, IShape shape) {
		super(metaitem);
		for(MetaProperty mp : metaitem.getProperties()) {
			properties.add(new Property(mp));
		}
		this.shape = shape;
		bound = new Rectangle2D(0,0,50,getProperty().size() * 20);
	}

	public Object clone() {
		return new NodeObject((MetaObject)this.metaElement, shape);
	}
	
	@Override
	public void draw(GraphicManager gm) {
		gm.setColor(color);
		shape.draw(gm, bound);
		int h = 0;
		for(Property p : getProperty()) {
			if(p.getContent() != null) {
				gm.DrawText(p.getContent(), (int)bound.x, (int)bound.y + 20 + h * 20, 100);
			}
			h++;
		}
	}

	@Override
	public boolean contains(Point2D aPoint) {
		return bound.contains(aPoint.getX(), aPoint.getY());
	}
	
	public void translate(double dx, double dy) {
		bound.x += dx;
		bound.y += dy;
	}
	
	public Point2D getConnectionPoint(Line2D d) {
		if(d.intersectsLine(bound.x, bound.y, bound.x+bound.width, bound.y)) {
			return d.getConnect(new Line2D(bound.x, bound.y, bound.x+bound.width, bound.y));
		}
		if(d.intersectsLine(bound.x+bound.width, bound.y, bound.x+bound.width, bound.y+bound.height)) {
			return d.getConnect(new Line2D(bound.x+bound.width, bound.y, bound.x+bound.width, bound.y+bound.height));
		}
		if(d.intersectsLine(bound.x+bound.width, bound.y+bound.height, bound.x, bound.y+bound.height)) {
			return d.getConnect(new Line2D(bound.x+bound.width, bound.y+bound.height, bound.x, bound.y+bound.height));
		}
		if(d.intersectsLine(bound.x, bound.y+bound.height, bound.x, bound.y)) {
			return d.getConnect(new Line2D(bound.x, bound.y+bound.height, bound.x, bound.y));
		}
		return getLocation();
	}
	
	public Point2D getLocation() {
		return new Point2D(bound.getX()+bound.getWidth()/2, bound.getY()+bound.getHeight()/2);
	}

	public Rectangle2D getBounds() {
		return bound;
	}
	
	public List<Property> getProperty() {
		return properties;
	}
	*/
	
}
