package com.clooca.core.client.diagram;

import com.clooca.core.client.gopr.element.Diagram;
import com.clooca.core.client.gopr.element.NodeObject;


/**
 * @author f-lab-hiya
 *
 */
public interface GraphModificationListener {
 
	public abstract void nodeAdded(Diagram g, NodeObject n);
	public abstract void nodeRemoved(Diagram g, NodeObject n);
	public abstract void nodeMoved(Diagram g, NodeObject n, double dx, double dy);
	public abstract void childAttached(Graph g, int index, Node p, Node c);
	public abstract void childDetached(Graph g, int index, Node p, Node c);
	public abstract void edgeAdded(Graph g, Edge e);
	public abstract void edgeRemoved(Graph g, Edge e);
	public abstract void propertyChangedOnNodeOrEdge(Graph g, int event);
}
 
