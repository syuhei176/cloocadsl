package com.clooca.core.client.model.gopr.element;

import java.io.Serializable;

import com.clooca.core.client.model.gopr.metaelement.MetaElement;
import com.clooca.core.client.util.*;

public abstract class ModelElement implements Serializable, Cloneable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -8680773685747258202L;
	protected MetaElement metaElement;
	
	public ModelElement(MetaElement metaElement) {
		id = IdGenerator.getNewLongId();
		this.metaElement = metaElement;
	}
	
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
	
	private int id;
	
	/**
	 *  Returns a unique id of this node to make it easier to identify 
	 *   
	 *  @return a unique id 
	 * 
	 */
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	
	public MetaElement getMetaElement() {
		return metaElement;
	}
	

	protected String color = "BLACK";
	
	/**
	 * 
	 * @param color
	 */
	public void setColor(String color) {
		this.color = color;
	}
	
	abstract public Object clone();

}
