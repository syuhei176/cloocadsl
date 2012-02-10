package com.clooca.core.client.gopprr.element;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.diagram.GraphModificationListener;
import com.clooca.core.client.gopprr.metaelement.*;
import com.clooca.core.client.util.*;

public class Diagram extends ModelElement/* implements Cloneable*/ {
	
	private List<NodeObject> nodes = new ArrayList<NodeObject>();
	private List<Binding> bindings = new ArrayList<Binding>();
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
	
	public List<Binding> getBindings() {
		return bindings;
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
		for(Binding b : bindings) {
			b.draw(gm);
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
	 *  Finds a Binding containing the given point. 
	 *   
	 *  @param p a point 
	 *  @return a Binding containing p or null if no Bindings contain p 
	 * 
	 */
	public Binding findBinding(Point2D p) {
		for(Binding b : bindings) {
			if(b.contains(p)) return b;
		}
		return null;
	}

	/**
	 *  Finds a Relationship containing the given point. 
	 *   
	 *  @param p a point 
	 *  @return a relationship containing p or null if no relationships contain p 
	 * 
	 */
	public Relationship findRelationship(Point2D p) {
		for(Binding b : bindings) {
			if(b.contains(p)) return b.getRelationship();
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
	
	private boolean checkBinding(Relationship b, NodeObject n1, NodeObject n2) {
		List<MetaBinding> metabindings = new ArrayList<MetaBinding>();
		for(MetaBinding mb : ((MetaDiagram)getMetaElement()).getMetaBindings()) {
			if(mb.getMetarelation().getId() == b.getMetaElement().getId()) {
				metabindings.add(mb);
			}
		}
		for(MetaBinding mb : metabindings) {
			List<MetaRole> metaroles = mb.getMetaRoles();
			if(metaroles.get(0).getMetaObject().getId() == n1.getMetaElement().getId()) {
				if(metaroles.get(1).getMetaObject().getId() == n2.getMetaElement().getId()) {
	        		Role r1 = (Role)metaroles.get(0).getInstance();
	           		Role r2 = (Role)metaroles.get(1).getInstance();
	           		r1.connect(n1);
	           		r2.connect(n2);
	           		Binding binding = (Binding)mb.getInstance();
	           		binding.connect(r1, r2);
	               	add(binding);
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
	
	private void add(Binding b) {
		bindings.add(b);
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
//			l.nodeAdded(this, n);
		}	 
	}
	 
	public void fireNodeRemoved(NodeObject n) {
		for(GraphModificationListener l : listeners) {
//			l.nodeRemoved(this, n);
		}	 
	}

	public void fireNodeMoved(NodeObject node, double dx, double dy) {
		for(GraphModificationListener l : listeners) {
//			l.nodeMoved(this, node, dx, dy);
		}
	}
	
}
