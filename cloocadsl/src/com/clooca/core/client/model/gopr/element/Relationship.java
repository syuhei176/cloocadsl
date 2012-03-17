package com.clooca.core.client.model.gopr.element;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
import com.clooca.core.client.model.gopr.metaelement.MetaRelation;
import com.clooca.core.client.util.*;
import com.google.gwt.core.client.GWT;

public class Relationship {
	
	public int id;
	public MetaRelation meta;
	public NodeObject src;
	public NodeObject dest;
	public List<Property> properties = new ArrayList<Property>();
	public VersionElement ve = new VersionElement();
	public List<Point2D> points = new ArrayList<Point2D>();
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -2123890117304060211L;
//	Binding parent;
	
/*	
	@Override
	public void draw(GraphicManager gm) {
		gm.setColor(color);
		gm.beginPath();
		gm.moveTo(src.getConnectionPoint(getStartDirection()));
		gm.LineTo(dest.getConnectionPoint(getEndDirection()));
		int xx = (int) ((src.getLocation().x + dest.getLocation().x) / 2);
		int yy = (int) ((src.getLocation().y + dest.getLocation().y) / 2);
		for(Property p : getProperty()) {
			GWT.log(p.getContent());
			if(p.getContent() != null) {
				gm.DrawText(p.getContent(), xx, yy + 20, 100);
			}
		}
		gm.stroke();
		gm.closePath();
	}

	@Override
	public boolean contains(Point2D aPoint) {
		if((new Line2D(src.getLocation(), dest.getLocation())).ptSegDist(aPoint) < 14) {
			return true;
		}
		return false;
	}
	
	public void connect(NodeObject r1, NodeObject r2) {
		src = r1;
		dest = r2;
	}
	
	Line2D getStartDirection() {
		return new Line2D(src.getLocation(), dest.getLocation());
	}
	
	Line2D getEndDirection() {
		return new Line2D(src.getLocation(), dest.getLocation());
	}
	
	public NodeObject getSrc() {
		return src;
	}

	public NodeObject getDest() {
		return dest;
	}
	
	public List<Property> getProperty() {
		return properties;
	}
	*/
	
}
