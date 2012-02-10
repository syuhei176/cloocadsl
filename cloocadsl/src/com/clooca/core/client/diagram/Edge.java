package com.clooca.core.client.diagram;

import java.util.List;

import com.clooca.core.client.util.*;


/**
 * Edge of Graph
 * @author Syuhei Hiya
 * @version 1
 *
 */
public interface Edge extends ModelElement {
 
	/**
	 *  Connect this edge to two nodes. 
	 *   
	 *  @param aStart the starting node 
	 *  @param anEnd the ending node 
	 * 
	 */
	public abstract void connect(Node aStart, Node anEnd);
	/**
	 *  Gets the starting node. 
	 *   
	 *  @return the starting node 
	 * 
	 */
	public abstract Node getStart();
	/**
	 *  Gets the ending node. 
	 *   
	 *  @return the ending node 
	 * 
	 */
	public abstract Node getEnd();
	
	/**
	 * 
	 */
	public abstract List<Point2D> getConnectionPoints();
	
	/**
	 * 
	 */
	public abstract Rectangle2D getBounds();

	/**
	 *  Returns current edge revision 
	 * 
	 */
	public abstract Integer getRevision();
	/**
	 *  Updates current edge revision number 
	 *  @param newRevisionNumber n 
	 * 
	 */
	public abstract void setRevision(Integer newRevisionNumber);
	/**
	 *  Auto-increments revision number 
	 * 
	 */
	public abstract void incrementRevision();
	public abstract String getName();
	public abstract void setName(String text);
	public abstract String getImagePath();
	public abstract void setColor(String color);
}
 
