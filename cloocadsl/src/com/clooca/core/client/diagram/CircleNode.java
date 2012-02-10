package com.clooca.core.client.diagram;

import com.clooca.core.client.util.*;

/**
 * CircleNodeは�?���?��はShapeNodeに合体させた�?
 * @author Syuhei Hiya
 *
 */
public abstract class CircleNode implements Node {
 
	/**
	 * 
	 */
	private static final long serialVersionUID = 5894048875794575613L;

	private Rectangle2D bound;
	
	private Point2D location = new Point2D();
	
	int z;
	
	String id;
	
	Graph graph;

	public CircleNode() {
		bound = new Rectangle2D();
		z = 0;
		id = IdGenerator.getNewId();
		bound.x = -15;
		bound.y = -15;
		bound.width = 30;
		bound.height = 30;
	}
	
	private int circle_type = 0;
	
	public CircleNode(int type) {
		bound = new Rectangle2D();
		z = 0;
		id = IdGenerator.getNewId();
		bound.x = -15;
		bound.y = -15;
		bound.width = 30;
		bound.height = 30;
		circle_type = type;
	}

	
	abstract public AbstractPropertyArea getPropertyArea();
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#draw(int)
	 */
	public void draw(GraphicManager gm) {
		gm.setColor(color);
		gm.StrokeCircle(location, 15);
		gm.setColor("BLACK");
		if(circle_type == 0) {
			gm.FillCircle(location, 14);
		}else if(circle_type == 1) {
			gm.FillCircle(location, 10);			
		}
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#translate(double, double)
	 */
	public void translate(double dx, double dy) {
		bound.x += dx;
		bound.y += dy;
		location.x = bound.x + bound.width / 2;
		location.y = bound.y + bound.height / 2;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#getLocation()
	 */
	public Point2D getLocation() {
		return (Point2D) location.clone();
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#contains(int)
	 */
	public boolean contains(Point2D aPoint) {
		return bound.contains(aPoint.getX(), aPoint.getY());
	}
	 
	/**
	 * @see com.lservice.diagla.edu.client.framework.diagram.Node#getConnectionPoint(Direction)
	 */
/*	public int getConnectionPoint(Direction d) {
		return 0;
	}*/
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#getBounds()
	 */
	public Rectangle2D getBounds() {
		return bound;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#checkAddEdge(Edge, int, int)
	 */
	public boolean checkAddEdge(Edge e, Point2D p1, Point2D p2) {
		return false;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#checkAddNode(com.lservice.diagla.common.client.framework.diagram.Node, int)
	 */
	public boolean checkAddNode(Node n, Point2D p) {
		return false;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#checkRemoveEdge(Edge)
	 */
	public void checkRemoveEdge(Edge e) {
	 
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#checkRemoveNode(com.lservice.diagla.common.client.framework.diagram.Node)
	 */
	public void checkRemoveNode(Node n) {
	 
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#checkPasteChildren(int)
	 */
	public boolean checkPasteChildren(int children) {
		return false;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#layout(int, Grid)
	 */
	public void layout(int g2, Grid grid) {
	 
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#getParent()
	 */
	public Node getParent() {
		return null;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#getChildren()
	 */
	public int getChildren() {
		return 0;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#addChild(int, com.lservice.diagla.common.client.framework.diagram.Node)
	 */
	public void addChild(int index, Node node) {
	 
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#removeChild(com.lservice.diagla.common.client.framework.diagram.Node)
	 */
	public void removeChild(Node node) {
	 
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#getZ()
	 */
	public int getZ() {
		return z;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#setZ(int)
	 */
	public void setZ(int z) {
		this.z = z;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#getId()
	 */
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#getRevision()
	 */
	public Integer getRevision() {
		return null;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#setRevision(java.lang.Integer)
	 */
	public void setRevision(Integer newRevisionNumber) {
	 
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#incrementRevision()
	 */
	public void incrementRevision() {
	 
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#setGraph(Graph)
	 */
	public void setGraph(Graph g) {
		graph = g;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#getGraph()
	 */
	public Graph getGraph() {
		return graph;
	}
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#clone()
	 */
	abstract public Node clone();

	public Point2D getConnectionPoint(Line2D d) {
		return location;
	}

	private String color = "BLACK";
	
	public void setColor(String color) {
		this.color = color;
	}


}
 
