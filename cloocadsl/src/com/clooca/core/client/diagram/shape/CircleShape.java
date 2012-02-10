package com.clooca.core.client.diagram.shape;

import com.clooca.core.client.util.*;

public class CircleShape implements IShape {

	int radius = 20;
	
	boolean fill = false;
	
	public CircleShape(int r, boolean fill) {
		this.radius = r;
		this.fill = fill;
	}
	
	@Override
	public void draw(GraphicManager gm, Rectangle2D bound) {
		if(fill) {
			gm.FillCircle(new Point2D(bound.getX(),bound.getY()), radius);
		}else{
			gm.StrokeCircle(new Point2D(bound.getX(),bound.getY()), radius);
		}
	}

	@Override
	public boolean contains(Point2D aPoint, Rectangle2D bound) {
		return bound.contains(aPoint.getX(), aPoint.getY());
	}
}
