package com.clooca.core.client.gopr.element;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.diagram.GraphModificationListener;
import com.clooca.core.client.gopr.metamodel.*;
import com.clooca.core.client.util.*;
import com.google.gwt.core.client.GWT;

public class Diagram extends ModelElement/* implements Cloneable*/ {
	
	private List<NodeObject> nodes = new ArrayList<NodeObject>();
	private List<Relationship> relationships = new ArrayList<Relationship>();
	private ArrayList<GraphModificationListener> listeners = new ArrayList<GraphModificationListener>();

	public Diagram(MetaElement meta) {
		super(meta);
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = -5741155386373928424L;
	
	public List<NodeObject> getNodeObjects() {
		return nodes;
	}
	
	public List<Relationship> getRelationships() {
		return relationships;
	}
	
	@Override
	public Object clone() {
		return new Diagram(metaElement);
	}

	@Override
	public void draw(GraphicManager gm) {
		for(NodeObject no : nodes) {
			no.draw(gm);
		}
		for(Relationship r : relationships) {
			r.draw(gm);
		}

	}

	@Override
	public boolean contains(Point2D aPoint) {
		return true;
	}
	
	
	/**
	 *  Finds a node containing the given point. 
	 *   
	 *  @param p a point 
	 *  @return a node containing p or null if no nodes contain p 
	 * 
	 */
	public NodeObject findNode(Point2D p) {
		for(NodeObject n : nodes) {
			if(n.contains(p)) return n;
		}
		return null;
	}
	
	/**
	 *  Finds a Relationship containing the given point. 
	 *   
	 *  @param p a point 
	 *  @return a Relationship containing p or null if no Relationships contain p 
	 * 
	 */
	public Relationship findRelationship(Point2D p) {
		for(Relationship r : relationships) {
			if(r.contains(p)) return r;
		}
		return null;
	}
	
	/**
	 * 
	 * @param newNode
	 * @param p
	 * @return
	 */
	public boolean addNodeAtPoint(NodeObject newNode, Point2D p) {
		newNode.translate(p.x - newNode.getLocation().getX(), p.y - newNode.getLocation().getY());
		for (NodeObject n : nodes) {
    		if(n.contains(p)) {
    			return false;
    		}
        }
        add(newNode);
		return true;
	}
	
	/**
	 * 
	 * @param e
	 * @param p1
	 * @param p2
	 * @param flag
	 * @return
	 */
	public boolean addEdgeAtPoints(Relationship b, Point2D p1, Point2D p2) {
        NodeObject n1 = findNode(p1);
        NodeObject n2 = findNode(p2);
        if (n1 != null) {
        	if(checkBinding(b, n1, n2)) {
            	return true;
        	}
        }
		return false;
	}
	
	private boolean checkBinding(Relationship r, NodeObject n1, NodeObject n2) {
		MetaRelation mr = (MetaRelation)r.getMetaElement();
		for(Binding b : mr.getBindings()) {
			GWT.log(b.getSrc().getId() + "," + b.getDest().getId());
			if(b.getSrc().getId() == n1.getMetaElement().getId()) {
				if(b.getDest().getId() == n2.getMetaElement().getId()) {
					r.connect(n1, n2);
					add(r);
					return true;
				}
			}
		}
		return false;
	}

	
	public void removeNode(NodeObject n) {
		nodes.remove(n);
		/* Remove Relationship
		ArrayList<Edge> remove_edge = new ArrayList<Edge>();
		for(Edge e : edges) {
			if(e.getStart().getId() == n.getId() || e.getEnd().getId() == n.getId()) {
				remove_edge.add(e);
			}
		}
		for(Edge e : remove_edge) {
			removeEdge(e);
		}
		*/
		fireNodeRemoved(n);
	}
	
	private void add(NodeObject obj) {
		nodes.add(obj);
	}
	
	private void add(Relationship r) {
		relationships.add(r);
	}
	
	private void remove(NodeObject n) {
		nodes.remove(n);
		fireNodeRemoved(n);
	}
	
	public void addGraphModificationListener(GraphModificationListener listener) {
		listeners.add(listener);
	}
	
	public void fireNodeAdded(NodeObject n) {
		for(GraphModificationListener l : listeners) {
			l.nodeAdded(this, n);
		}	 
	}
	 
	public void fireNodeRemoved(NodeObject n) {
		for(GraphModificationListener l : listeners) {
			l.nodeRemoved(this, n);
		}	 
	}

	public void fireNodeMoved(NodeObject node, double dx, double dy) {
		for(GraphModificationListener l : listeners) {
			l.nodeMoved(this, node, dx, dy);
		}
	}
	
}
