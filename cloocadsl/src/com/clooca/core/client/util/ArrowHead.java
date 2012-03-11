package com.clooca.core.client.util;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author Syuhei Hiya
 *
 */
public class ArrowHead {
 	
	private List<Point2D> path;
	
	public enum ArrowType {NONE, V, TRIANGLE, BLACK_TRIANGLE, DIAMOND, BLACK_DIAMOND};
	
	private ArrowType type;
	
	/**
	 * create arrow
	 * @param type
	 */
	public ArrowHead(ArrowType type) {
		this.type = type;
	}
	
	/**
	 * draw
	 * @param gm
	 * @param p
	 * @param q
	 */
	public void draw(GraphicManager gm, Point2D p, Point2D q) {
        if (type == ArrowType.NONE) return;
		List<Point2D> lpath = getPath(p, q);
		gm.beginPath();
		gm.moveTo(lpath.get(0));
		for(int i=1;i < lpath.size();i++) {
			gm.LineTo(lpath.get(i));
		}
		gm.LineTo(lpath.get(0));
		gm.stroke();
		gm.closePath();
	}
	
	/**
	 * 
	 * @param p
	 * @param q
	 * @return
	 */
	private List<Point2D> getPath(Point2D p, Point2D q) {
		path = new ArrayList<Point2D>();
        final double ARROW_ANGLE = Math.PI / 6;
        final double ARROW_LENGTH = 10;

        double dx = q.getX() - p.getX();
        double dy = q.getY() - p.getY();
        double angle = Math.atan2(dy, dx);
        double x1 = q.getX() - ARROW_LENGTH * Math.cos(angle + ARROW_ANGLE);
        double y1 = q.getY() - ARROW_LENGTH * Math.sin(angle + ARROW_ANGLE);
        double x2 = q.getX() - ARROW_LENGTH * Math.cos(angle - ARROW_ANGLE);
        double y2 = q.getY() - ARROW_LENGTH * Math.sin(angle - ARROW_ANGLE);

        if (type == ArrowType.V)
        {
    		path.add(new Point2D(x1, y1));
            path.add(new Point2D(q.getX(), q.getY()));
            path.add(new Point2D(x2, y2));
            path.add(new Point2D(q.getX(), q.getY()));
            path.add(new Point2D(x1, y1));
        }
        else if (type == ArrowType.TRIANGLE || type == ArrowType.BLACK_TRIANGLE)
        {
            path.add(new Point2D(q.getX(), q.getY()));
            path.add(new Point2D(x1, y1));
            path.add(new Point2D(x2, y2));
        }
        else if (type == ArrowType.DIAMOND || type == ArrowType.BLACK_DIAMOND)
        {
            path.add(new Point2D(q.getX(), q.getY()));
            path.add(new Point2D(x1, y1));
            double x3 = x2 - ARROW_LENGTH * Math.cos(angle + ARROW_ANGLE);
            double y3 = y2 - ARROW_LENGTH * Math.sin(angle + ARROW_ANGLE);
            path.add(new Point2D(x3, y3));
            path.add(new Point2D(x2, y2));
        }
        return path;
	}
}
 
