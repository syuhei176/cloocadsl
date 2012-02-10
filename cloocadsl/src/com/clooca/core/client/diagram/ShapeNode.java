package com.clooca.core.client.diagram;

import com.google.gwt.dom.client.ImageElement;
import com.clooca.core.client.diagram.shape.IShape;
import com.clooca.core.client.util.*;

public abstract class ShapeNode implements Node {
 
	/**
	 * 
	 */
	private static final long serialVersionUID = 137211001877284484L;

	private Rectangle2D bound;
	
	private Point2D location = new Point2D();
	
	int z;
	
	String id;
	
	Graph graph;
	
	public static ImageElement hide_img;
	
	protected IShape shape;
	
	public ShapeNode(IShape shape) {
		super();
		this.shape = shape;
		bound = new Rectangle2D();
		z = 0;
		id = IdGenerator.getNewId();
		bound.x = -25;
		bound.y = -25;
		bound.width = 50;
		bound.height = 50;
	}

		
	abstract public AbstractPropertyArea getPropertyArea();
	 
	/**
	 * @see com.lservice.diagla.common.client.framework.diagram.Node#draw(int)
	 */
	public void draw(GraphicManager gm) {
		/*
		if(_is_show_detail) {
			Rectangle2D prop_bound = getPropertyArea().getBound();
			bound.width = prop_bound.getWidth();
			if(bound.width < 60) bound.width = 100;
			bound.height = prop_bound.getHeight();
		}else{
			bound.width = 100;
			bound.height = 100;
		}
		*/
		gm.setColor(color);
		shape.draw(gm, bound);
//		getPropertyArea().draw(gm, bound);
		
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
		return shape.contains(aPoint, bound);
	}
	 
	/**
	 * @see com.lservice.diagla.edu.client.framework.diagram.Node#getConnectionPoint(Direction)
	 */
	/*
	public int getConnectionPoint(Direction d) {
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
	abstract public Object clone();
	
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
		return location;
	}
	
	private String color = "BLACK";
	
	public void setColor(String color) {
		this.color = color;
	}

	public void hide_detail() {
		if(getPropertyArea() instanceof StackPropertyArea) {
			((StackPropertyArea)getPropertyArea()).hide_detail();
			_is_show_detail = false;
		}
	}

	public void show_detail() {
		if(getPropertyArea() instanceof StackPropertyArea) {
			((StackPropertyArea)getPropertyArea()).show_detail();
			_is_show_detail = true;
		}
	}
	
	public boolean _is_show_detail() {
		return _is_show_detail;
	}

	private boolean _is_show_detail = true;
	

}
 
