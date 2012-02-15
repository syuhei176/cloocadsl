package com.clooca.core.client.gopr.element;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.diagram.GraphModificationListener;
import com.clooca.core.client.gopr.RequestCommands;
import com.clooca.core.client.gopr.metamodel.*;
import com.clooca.core.client.util.*;
import com.clooca.webutil.client.RequestGenerator;
import com.google.gwt.core.client.GWT;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.user.client.Window;

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
	
	public NodeObject findNode(int id) {
		for(NodeObject n : nodes) {
			if(n.getId() == id) return n;
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
	
	
	public void trasitionNode(double dx, double dy, NodeObject no) {
		no.translate(dx, dy);
        command_list.updateObject(no.getId(), (int)no.getLocation().getX(), (int)no.getLocation().getY());
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
        command_list.addObject(newNode.getMetaElement().getId(), (int)p.getX(), (int)p.getY(), getId(), newNode.getId());
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
        		command_list.addRelationship(b.getMetaElement().getId(), n1.getId(), n2.getId(), getId(), b.getId());
            	return true;
        	}
        }
		return false;
	}
	
	public boolean addEdge(Relationship b, int p1id, int p2id) {
        NodeObject n1 = findNode(p1id);
        NodeObject n2 = findNode(p2id);
        if (n1 != null) {
        	if(checkBinding(b, n1, n2)) {
        		command_list.addRelationship(b.getMetaElement().getId(), n1.getId(), n2.getId(), getId(), b.getId());
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
		//Remove Relationship
		List<Relationship> remove_edge = new ArrayList<Relationship>();
		for(Relationship e : relationships) {
			if(e.getSrc().getId() == n.getId() || e.getDest().getId() == n.getId()) {
				remove_edge.add(e);
			}
		}
		for(Relationship e : remove_edge) {
			removeRelationship(e);
		}
		fireNodeRemoved(n);
        command_list.deleteObject(n.getId());
	}
	
	public void removeRelationship(Relationship r) {
		relationships.remove(r);
		command_list.deleteRelationship(r.getId());
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
	
	RequestCommands command_list = new RequestCommands();
	
	public void clearCommand() {
		command_list.clear();
	}
	
	public void sendCommand(int pid) {
      	RequestGenerator.send("/cgi-bin/core/save.cgi", "pid="+pid+"&command="+command_list.getXML(), new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			Window.alert(response.getText());
    			JSONObject jsonObject = JSONParser.parseLenient(response.getText()).isObject();
    			JSONArray jsonArray = jsonObject.get("object_ids").isArray();
    			for(int i=0;i < jsonArray.size();i++) {
    				JSONObject json_objectid;
    				json_objectid = jsonArray.get(i).isObject();
    				int local_id = (int) json_objectid.get("local_id").isNumber().doubleValue();
    				int global_id = (int) json_objectid.get("global_id").isNumber().doubleValue();
    				findNode(local_id).setId(global_id);
    			}
    			command_list.clear();
    		}});
	}
		
}
