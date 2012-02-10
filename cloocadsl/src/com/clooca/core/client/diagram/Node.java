package com.clooca.core.client.diagram;

import com.clooca.core.client.util.*;

/**
 * a node of graph
 * @author Syuhei Hiya
 * @version 2
 *
 */
public interface Node extends ModelElement {
 
	/**
	 *  Translates the node by a given amount 
	 *   
	 *  @param dx the amount to translate in the x-direction 
	 *  @param dy the amount to translate in the y-direction 
	 * 
	 */
	public abstract void translate(double dx, double dy);
	
	/**
	 * 
	 * @return
	 */
	public abstract Point2D getLocation();
	
	/**
	 * 
	 */
	public abstract Point2D getConnectionPoint(Line2D d);

	/**
	 * 
	 */
	public abstract Rectangle2D getBounds();
	
	
	public abstract void layout(GraphicManager gm, Grid grid);
	
	/**
	 * 
	 */
	public abstract int getZ();
	
	/**
	 * 
	 */
	public abstract void setZ(int z);
	

	/**
	 *  Returns current node revision 
	 * 
	 */
	public abstract Integer getRevision();
	/**
	 *  Updates current node revision number 
	 *  @param newRevisionNumber n 
	 * 
	 */
	public abstract void setRevision(Integer newRevisionNumber);
	/**
	 *  Increments revision number 
	 * 
	 */
	public abstract void incrementRevision();
	/**
	 *  Sets the graph that contains this node. 
	 *  @param g the graph 
	 * 
	 */
	public abstract void setGraph(Graph g);
	/**
	 *  Gets the graph that contains this node, or null if this node is not contained in any graph. 
	 *  @return 
	 * 
	 */
	public abstract Graph getGraph();
	/**
	 * metamodel
	 * @return
	 */
	public Graph getPrototype();
	/**
	 * link to graph
	 * @param g
	 * @return
	 */
	public boolean LinkToGraph(Graph g);
	/**
	 * get linked graph
	 * @return
	 */
	public Graph GetLinkedGraph();
	public abstract String getName();
	public abstract void setName(String text);
	public abstract String getImagePath();
	public abstract void setColor(String color);
}
 
