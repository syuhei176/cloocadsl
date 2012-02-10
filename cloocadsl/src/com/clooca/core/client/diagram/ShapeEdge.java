package com.clooca.core.client.diagram;

import java.util.ArrayList;
import java.util.List;
import com.google.gwt.core.client.GWT;
import com.clooca.core.client.util.*;
import com.clooca.core.client.diagram.ArrowHead.ArrowType;

/**
 * 
 * @author Syuhei Hiya
 *
 */
public abstract class ShapeEdge implements Edge {
 
	/**
	 * 
	 */
	private static final long serialVersionUID = 8693261946515222018L;

	private ArrowHead starthead, endhead;
	
	public enum LineType {NORMAL_LINE, DOTTED_LINE};
	
	private LineType lineType;
	
	private Node start, end;
	
	private List<Point2D> path;
	
	String id;
	
	Graph graph;
	
	Line2D getStartDirection() {
		if(path.size() > 0) {
			return new Line2D(start.getLocation(), path.get(0));
		}
		return new Line2D(start.getLocation(), end.getLocation());
	}
	
	Line2D getEndDirection() {
		if(path.size() > 0) {
			return new Line2D(path.get(path.size() - 1), end.getLocation());
		}
		return new Line2D(start.getLocation(), end.getLocation());
	}

	
	public ShapeEdge() {
		id = IdGenerator.getNewId();
		path = new ArrayList<Point2D>();
		lineType = LineType.NORMAL_LINE;
		this.setArrowHead(ArrowHead.ArrowType.NONE, ArrowHead.ArrowType.NONE);
	}
	
	abstract public AbstractPropertyArea getPropertyArea();

	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Edge#draw(int)
	 */
	public void draw(GraphicManager gm) {
		if(start.getId() == end.getId()) {
			/*
			 * 自己参�?
			 */
			int state_width = 0;
			int state_height = 0;
			path.get(0).x = start.getLocation().x;
			if(getStart() instanceof RectangleNode) {
				state_width = (int) ((RectangleNode)getStart()).getPropertyArea().getBound().getWidth();
				state_height = ((RectangleNode)getStart()).getPropertyArea().getHeight();
			}else{
				state_width = 60;
				state_height = 60;
			}
			path.get(0).y = start.getLocation().y + state_height;
			path.get(1).x = start.getLocation().x + state_width;
			path.get(1).y = start.getLocation().y + state_height;
			path.get(2).x = start.getLocation().x + state_width;
			path.get(2).y = start.getLocation().y;
		}
		
		ArrayList<Point2D> tmp_path = new ArrayList<Point2D>();
		tmp_path.add(start.getConnectionPoint(getStartDirection()));
		
		for(int i=0;i < path.size();i++) {
			tmp_path.add(path.get(i));
		}
		
		tmp_path.add(end.getConnectionPoint(this.getEndDirection()));
		gm.setColor(color);
		gm.beginPath();
		if(lineType == LineType.NORMAL_LINE) {
			gm.moveTo(tmp_path.get(0));
			for(int i=1;i < tmp_path.size();i++) {
				gm.LineTo(tmp_path.get(i));
			}
		} else {
			//点線を実�?
			gm.moveTo(tmp_path.get(0));
			for(int i=1;i < tmp_path.size();i++) {
				gm.LineTo(tmp_path.get(i));
			}
		}
		gm.stroke();
		gm.closePath();
		/*
		 * 矢印を描画
		 */

		starthead.draw(gm, tmp_path.get(1), tmp_path.get(0));
		endhead.draw(gm, tmp_path.get(tmp_path.size() - 2), tmp_path.get(tmp_path.size() - 1));
		
		/*
		 * �?��を表示
		 */
		if(getPropertyArea() != null) {
		if(path.size() >= 1) {
			Point2D sum = new Point2D(getStart().getLocation().getX() + getEnd().getLocation().getX(), getStart().getLocation().getY() + getEnd().getLocation().getY());
			for(Point2D p : path) {
				sum.x += p.x;
				sum.y += p.y;
			}
			
			sum.x /= (path.size() + 2);
			sum.y /= (path.size() + 2);

			Rectangle2D rect = new Rectangle2D(sum.x-30, sum.y, 30, 40);

			getPropertyArea().draw(gm, rect);
		}else{
			Point2D startConnectionPoint = start.getConnectionPoint(getStartDirection());
			Point2D endConnectionPoint = end.getConnectionPoint(getEndDirection());
			getPropertyArea().draw(gm, new Rectangle2D(startConnectionPoint.getX(),
					startConnectionPoint.getY(), 
					endConnectionPoint.getX() - startConnectionPoint.getX(),
					endConnectionPoint.getY() - startConnectionPoint.getY()));
		}
		}
	}
	 
	/**
	 * 
	 * if line contains point
	 * 
	 * @see com.lservice.diagla.common.client.framework.diagram.Edge#contains(int)
	 * 
	 * @param aPoint point
	 * 
	 * @return contains or not
	 * 
	 */
	public boolean contains(Point2D aPoint) {
		for(int i=0;i < path.size() - 1;i++) {
			if((new Line2D(path.get(i), path.get(i+1))).ptSegDist(aPoint) < 14) {
				return true;
			}
		}
		if(path.size() > 1) {
			Point2D s, e;
			s = start.getLocation();
			e = end.getLocation();
			if((new Line2D(s, path.get(0))).ptSegDist(aPoint) < 14) {
				return true;
			}
			if((new Line2D(e, path.get(path.size() - 1))).ptSegDist(aPoint) < 14) {
				return true;
			}
		} else if(path.size() == 1) {
			Point2D s, e;
			s = start.getLocation();
			e = end.getLocation();
			if((new Line2D(s, path.get(0))).ptSegDist(aPoint) < 14) {
				return true;
			}
			if((new Line2D(e, path.get(0))).ptSegDist(aPoint) < 14) {
				return true;
			}
		} else if(path.size() == 0) {
			Point2D s, e;
			s = start.getLocation();
			e = end.getLocation();
			if((new Line2D(s, e)).ptSegDist(aPoint) < 14) {
				return true;
			}
		}
		return false;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Edge#connect(Node, Node)
	 */
	public void connect(Node aStart, Node anEnd) {
		start = aStart;
		end = anEnd;
		if(start.getId() == end.getId() && path.size() == 0) {
			/*
			 * 自己参�?
			 */
			path.add(new Point2D(start.getLocation().getX(), start.getLocation().getY() + 80));
			path.add(new Point2D(start.getLocation().getX() + 60, start.getLocation().getY() + 80));
			path.add(new Point2D(start.getLocation().getX() + 60, start.getLocation().getY()));
		}
	}
	
	/**
	 * 
	 * @param p
	 */
	public void addpoint(Point2D p) {
		path.add(p);
	}
	
	/**
	 * move l to p
	 * @param l
	 * @param p
	 */
	public void movepoint(Point2D l, Point2D p) {
		boolean flg = true;
		for(int i=0;i < path.size();i++) {
			if(path.get(i).distance(l) < 10) {
				path.get(i).x = p.x;
				path.get(i).y = p.y;
				flg = false;
				break;
			}
		}
		List<Line2D> lines = new ArrayList<Line2D>();
		if(path.size() == 0) {
			lines.add(new Line2D(start.getLocation(), end.getLocation()));
		}else{
			lines.add(new Line2D(start.getLocation(), path.get(0)));
			for(int i=0;i < path.size() - 1;i++) {
				lines.add(new Line2D(path.get(i), path.get(i+1)));
			}
			lines.add(new Line2D(path.get(path.size()-1), end.getLocation()));
		}
		
		int minp = 0;
		double min = 10000;
		for(int i=0;i < lines.size();i++) {
			double dist = lines.get(i).ptSegDist(l);
			if(min > dist) {
				min = dist;
				minp = i;
			}
		}
		
		if(flg) {
			GWT.log(""+minp);
			path.add(minp, p);
		}
	}
	
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Edge#getStart()
	 */
	public Node getStart() {
		return start;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Edge#getEnd()
	 */
	public Node getEnd() {
		return end;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Edge#getConnectionPoints()
	 */
	public List<Point2D> getConnectionPoints() {
		return path;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Edge#getBounds(int)
	 */
	public Rectangle2D getBounds() {
		double sx = start.getLocation().x;
		double sy = start.getLocation().y;
		double ex = end.getLocation().x;
		double ey = end.getLocation().y;
		if(sx < ex) {
			if(sy < ey) {
				return new Rectangle2D(sx, sy, ex - sx, ey - sy);
			}else{
				return new Rectangle2D(sx, ey, ex - sx, sy - ey);
			}
		}else{
			if(sy < ey) {
				return new Rectangle2D(ex, sy, sx - ex, ey - sy);
			}else{
				return new Rectangle2D(ex, ey, sx - ex, sy - ey);
			}
		}
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Edge#getId()
	 */
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Edge#getRevision()
	 */
	public Integer getRevision() {
		return null;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Edge#setRevision(java.lang.Integer)
	 */
	public void setRevision(Integer newRevisionNumber) {
	 
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Edge#incrementRevision()
	 */
	public void incrementRevision() {
	 
	}
	
	public void setArrowHead(ArrowType s, ArrowType e) {
		this.starthead = new ArrowHead(s);
		this.endhead = new ArrowHead(e);
	}
	
	public void setLineType(LineType lt) {
		lineType = lt;
	}
	
	private String color = "BLACK";
	
	public void setColor(String color) {
		this.color = color;
	}
	
	abstract public Object clone();
}
