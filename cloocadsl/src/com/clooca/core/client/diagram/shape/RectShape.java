package com.clooca.core.client.diagram.shape;

import com.clooca.core.client.util.*;

public class RectShape implements IShape {
	
	@Override
	public void draw(GraphicManager gm, Rectangle2D bound) {
		gm.StrokeRect(bound);
	}

	@Override
	public boolean contains(Point2D aPoint, Rectangle2D bound) {
		return bound.contains(aPoint.getX(), aPoint.getY());
	}
	
}
