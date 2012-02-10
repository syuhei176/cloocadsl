package com.clooca.core.client.diagram;

import java.io.Serializable;

import com.clooca.core.client.util.*;

public interface ModelElement extends Serializable, Cloneable {
	/*
	long id;
	
	public ModelElement() {
		this(IdGenerator.getNewLongId());
	}
	
	public ModelElement(long id) {
		this.id = id;
	}
	
	long getId() {
		return id;
	}
	*/
	/**
	 *  Draw the edge. 
	 *   
	 *  @param gm the graphic manager 
	 * 
	 */
	public abstract void draw(GraphicManager gm);
	
	/**
	 *  Tests whether the edge contains a point. 
	 *   
	 *  @param aPoint the point to test 
	 *  @return true if this edge contains aPoint 
	 * 
	 */
	public abstract boolean contains(Point2D aPoint);
	
	/**
	 *  Returns a unique id of this node to make it easier to identify 
	 *   
	 *  @return a unique id 
	 * 
	 */
	public abstract String getId();
	
	/**
	 * 
	 */
	public abstract void setId(String id);
	
	public abstract Object clone();
	
	public abstract void fromXML(com.google.gwt.xml.client.Node node);
	
	public abstract String toXML();
	
}
