package com.clooca.core.client.diagram.shape;

import com.clooca.core.client.util.*;

public interface IShape {
	public void draw(GraphicManager gm, Rectangle2D bound);
	public boolean contains(Point2D aPoint, Rectangle2D bound);
}
