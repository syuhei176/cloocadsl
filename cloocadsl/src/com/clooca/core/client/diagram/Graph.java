package com.clooca.core.client.diagram;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.gopprr.*;
import com.clooca.core.client.gopprr.element.NodeObject;
import com.clooca.core.client.gopprr.element.Relationship;
import com.clooca.core.client.gopprr.metaelement.MetaBinding;
import com.clooca.core.client.gopprr.metaelement.MetaDiagram;
import com.clooca.core.client.gui.Resource;
import com.clooca.core.client.util.*;


/**
 *  A graph consisting of selectable nodes and edges. 
 * 
 */
public abstract class Graph implements Serializable, Cloneable, Resource {
 
	/**
	 * 
	 */
	private static final long serialVersionUID = 109716613185929105L;

	private ArrayList<Node> nodes = new ArrayList<Node>();
	 
	private ArrayList<Edge> edges = new ArrayList<Edge>();
	 
	private ArrayList<Node> Removed_nodes;
	 
	private ArrayList<Edge> Removed_edges;
	 
	private ArrayList<GraphModificationListener> listeners = new ArrayList<GraphModificationListener>();
	 
	/**
	 *  Constructs a graph with no nodes or edges. 
	 * 
	 */
	public Graph(MetaDiagram meta) {
		this.meta_diagram = meta;
	}
	 
	/**
	 *   
	 *  @param e the edge to add 
	 *  @param p1 a point in the starting node 
	 *  @param p2 a point in the ending node 
	 * 
	 */
	public boolean addEdgeAtPoints(Edge e, Point2D p1, Point2D p2) {
		return addEdgeAtPoints(e, p1, p2, true);
	}
	
	private boolean checkBinding(Relationship eo, NodeObject n1, NodeObject n2) {
		long n1id = n1.getMetaElement().getId();
		long n2id = n2.getMetaElement().getId();
		long rid = eo.getMetaElement().getId();
		/*
		List<MetaBinding> mbs = new ArrayList<MetaBinding>();
		for(MetaBinding mb : this.meta_diagram.getMetaBindings()) {
			if(mb.getMetarelation_id() == rid) {
				long metaobj_id = meta_diagram.getMetaRoles().get((int) mb.getMetarole_id()).getMetaobj_id();
				if(metaobj_id == n1id || metaobj_id == n2id) {
					mbs.add(mb);
				}
			}
		}
		for(int i=0;i < mbs.size();i++) {
			if(checkBindingPart(mbs, i, mbs.get(i).getId())) {
				return true;
			}
		}
		*/
		return false;
	}
	
	private boolean checkBindingPart(List<MetaBinding> mbs, int index, long id) {
		for(int i=0;i < mbs.size();i++) {
			if(index == i) {
				
			} else {
				if(mbs.get(i).getId() == id) return true;
			}
		}
		return false;
	}
	
	public boolean addEdgeAtPoints(Edge e, Point2D p1, Point2D p2, boolean flag) {
        Node n1 = findNode(p1);
        Node n2 = findNode(p2);
        if (n1 != null) {
        	if(e instanceof Relationship && n1 instanceof NodeObject && n2 instanceof NodeObject) {
        		if(checkBinding((Relationship)e, (NodeObject)n1, (NodeObject)n2)) {
                	e.connect(n1, n2);
                	add(e, flag);
            		return true;
        		}
        	}else{
            	e.connect(n1, n2);
            	add(e, flag);
        		return true;
        	}
        }
		return false;
	}
	
	public boolean addEdgeAtPoints(Edge e, String m1id, String m2id) {
		return addEdgeAtPoints(e, m1id, m2id, true);
	}

	public boolean addEdgeAtPoints(Edge e, String m1id, String m2id, boolean flag) {
        Node n1 = findNode(m1id);
        Node n2 = findNode(m2id);
        if (n1 != null && n2 != null) {
        	e.connect(n1, n2);
        	add(e, flag);
    		return true;
        }
		return false;
	}

	 
	/**
	 *  Adds a node to the graph so that the top left corner of the bounding rectangle is at the given point. 
	 *   
	 *  @param newNode the node to add 
	 *  @param p the desired location 
	 * 
	 */
	public boolean addNodeAtPoint(Node newNode, Point2D p) {
		return addNodeAtPoint(newNode, p, true);
	}

	public boolean addNodeAtPoint(Node newNode, Point2D p, boolean flag) {
		newNode.translate(p.x - newNode.getLocation().getX(), p.y - newNode.getLocation().getY());
/*
		boolean accepted = false;
        boolean insideANode = false;
        int maxZ = 0;
        for (Node n : nodes)
        {
            if (n.getZ() > maxZ) maxZ = n.getZ();
        }
        for (int z = maxZ; !accepted && z >= 0; z--)
        {
            for (int i = 0; !accepted && i < nodes.size(); i++)
            {
                Node n = nodes.get(i);
                if (n.getZ() == z && n.contains(p))
                {
                    insideANode = true;
                    accepted = n.checkAddNode(newNode, p);
                }
            }
        }
        if (insideANode && !accepted) return false;
        */
        for (Node n : nodes) {
    		if(n.contains(p)) {
    			return false;
    		}
        }
        add(newNode, flag);
		return true;
	}
	
	/**
	 *  Finds a node containing the given point. 
	 *   
	 *  @param p a point 
	 *  @return a node containing p or null if no nodes contain p 
	 * 
	 */
	public Node findNode(Point2D p) {
		for(Node n : nodes) {
			if(n.contains(p)) return n;
		}
		return null;
	}
	 
	public Node findNode(String id) {
		for(Node n : nodes) {
			if(n.getId().matches(id)) return n;
		}
		return null;
	}
	
	public Node findNodeByName(String name) {
		for(Node n : nodes) {
			if(n.getName().matches(name)) return n;
		}
		return null;
	}

	 
	/**
	 *  Finds an edge containing the given point. 
	 *   
	 *  @param p a point 
	 *  @return an edge containing p or null if no edges contain p 
	 * 
	 */
	public Edge findEdge(Point2D p) {
		for(Edge e : edges) {
			if(e.contains(p)) return e;
		}
		return null;
	}
	 
	public Edge findEdge(String id) {
		for(Edge e : edges) {
			if(e.getId().matches(id)) return e;
		}
		return null;
	}
	 
	public Edge findEdgeByName(String name) {
		for(Edge e : edges) {
			if(e.getName().matches(name)) return e;
		}
		return null;
	}

	/**
	 *  Draws the graph 
	 *   
	 *  @param g2 the graphics context 
	 * 
	 */
	public void draw(GraphicManager gm, Grid g) {
		for(Node n : nodes) {
			n.draw(gm);
		}
		for(Edge e : edges) {
			e.draw(gm);
		}

//		gm.StrokeRect(new Rectangle2D(32, 32, 32, 32));
//		gm.stroke();
	}
	 
	/**
	 *  Removes the given nodes and edges from this graph 
	 *  @param nodesToRemove a collection of nodes to remove, or null to remove no nodes 
	 *  @param edgesToRemove a collection of edges to remove, or null to remove no edges 
	 * 
	 */
	public void removeNodesAndEdges(int nodesToRemove, int edgesToRemove) {
	 
	}
	 
	/**
	 *  Computes the layout of the graph. If you override this method, you must first call <code>super.layout</code>. 
	 *   
	 *  @param g the graphics context 
	 *  @param gr the grid to snap to 
	 * 
	 */
	public void layout(GraphicManager gm, Grid gr) {
	 
	}
	 
	/**
	 *   
	 *  @return the bounding rectangle 
	 * 
	 */
	public Rectangle2D getBounds(GraphicManager gm) {
		return null;
	}
	 
	public void setMinBounds(Rectangle2D newValue) {
	 
	}
	
	/**
	 *  Gets the nodes of this graph. 
	 *   
	 *  @return an unmodifiable collection of the nodes 
	 * 
	 */
	public ArrayList<Node> getNodes() {
		return nodes;
	}
	 
	/**
	 *  Gets the edges of this graph. 
	 *   
	 *  @return an unmodifiable collection of the edges 
	 * 
	 */
	public ArrayList<Edge> getEdges() {
		return edges;
	}
	 
	/**
	 *  Adds a node to this graph. This method is called by a decoder when reading a data file. 
	 *   
	 *  @param n the node to add 
	 *  @param p the desired location 
	 * 
	 */
	public void addNode(Node n, Point2D p) {
	 
	}
	 
	/**
	 *  Removes a node from this graph. 
	 *   
	 *  @param n 
	 * 
	 */
	public void removeNode(Node n) {
		removeNode(n, true);
	}
	
	public void removeNode(Node n, boolean flag) {
		nodes.remove(n);
		ArrayList<Edge> remove_edge = new ArrayList<Edge>();
		for(Edge e : edges) {
			if(e.getStart().getId() == n.getId() || e.getEnd().getId() == n.getId()) {
				remove_edge.add(e);
			}
		}
		for(Edge e : remove_edge) {
			removeEdge(e);
		}
		if(flag) fireNodeRemoved(n);
	}

	 
	/**
	 *   
	 * 
	 */
	public void connect(Edge e, Node start, Node end) {
	 
	}
	 
	/**
	 * 
	 */
	public void connect(Edge e, Node aStart, Point2D sPoint, Node anEnd, Point2D ePoint) {
	 
	}
	
	/**
	 * 
	 * @param e
	 */
	public void removeEdge(Edge e) {
		removeEdge(e, true);
	}
	
	public void removeEdge(Edge e, boolean flag) {
		edges.remove(e);
		if(flag) fireEdgeRemoved(e);
	}

	 
	public void addGraphModificationListener(GraphModificationListener listener) {
		listeners.add(listener);
	}
	 
	public synchronized void removeGraphModificationListener(GraphModificationListener listener) {
	
	}
	 
	private void add(Node n, boolean flag) {
		nodes.add(n);
		if(flag) fireNodeAdded(n);
	}
	
	private void add(Edge e, boolean flag) {
		edges.add(e);
		if(flag) fireEdgeAdded(e);
	}

	
	private void remove(Node n) {
		nodes.remove(n);
		fireNodeRemoved(n);
	}
	 
	public void changeNodeOrEdgeProperty(int e) {
		firePropertyChangeOnNodeOrEdge(e);
	}
	
	public void fireNodeAdded(Node n) {
		for(GraphModificationListener l : listeners) {
//			l.nodeAdded(this, n);
		}	 
	}
	 
	public void fireNodeRemoved(Node n) {
		for(GraphModificationListener l : listeners) {
//			l.nodeRemoved(this, n);
		}	 
	}
	 
	public void fireChildAttached(int index, Node p, Node c) {
	 
	}
	 
	public void fireChildDetached(int index, Node p, Node c) {
	 
	}
	 
	public void fireEdgeAdded(Edge e) {
		for(GraphModificationListener l : listeners) {
			l.edgeAdded(this, e);
		}	 
	}
	 
	public void fireEdgeRemoved(Edge e) {
		for(GraphModificationListener l : listeners) {
			l.edgeRemoved(this, e);
		}
	}
	 
	public void fireNodeMoved(Node node, double dx, double dy) {
		for(GraphModificationListener l : listeners) {
//			l.nodeMoved(this, node, dx, dy);
		}
	}
	 
	public void firePropertyChangeOnNodeOrEdge(int event) {
	 
	}
	
	abstract public Graph clone();
	
	protected String name;
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}
	
	protected MetaDiagram meta_diagram;
	
	public MetaDiagram getMetaDiagram() {
		return meta_diagram;
	}
}
 
