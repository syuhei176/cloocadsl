package com.clooca.core.client.gui;

import java.util.Stack;

import com.clooca.core.client.diagram.*;
import com.clooca.core.client.gopr.element.Diagram;
import com.clooca.core.client.gopr.element.NodeObject;
import com.clooca.core.client.util.*;

/**
 * History Manager
 * @author Syuhei Hiya
 * @version 1
 *
 */public class CanvasHistoryManager {
	
	Diagram graph;
	
	GraphModificationListener listener = new GraphModificationListener() {

		@Override
		public void childAttached(Graph g, int index, Node p, Node c) {
			// TODO Auto-generated method stub
			
		}

		@Override
		public void childDetached(Graph g, int index, Node p, Node c) {
			// TODO Auto-generated method stub
			
		}

		@Override
		public void edgeAdded(Graph g, Edge e) {
			undo_stack.push(new GraphModification(GraphModificationKind.EDGE_ADDED, e));
			redo_stack.clear();
			addHistory();
		}

		@Override
		public void edgeRemoved(Graph g, Edge e) {
			undo_stack.push(new GraphModification(GraphModificationKind.EDGE_REMOVED, e));
			redo_stack.clear();
			addHistory();
		}

		@Override
		public void nodeAdded(Diagram g, NodeObject n) {
			undo_stack.push(new GraphModification(GraphModificationKind.NODE_ADDED, n));
			redo_stack.clear();
			addHistory();
		}

		@Override
		public void nodeMoved(Diagram g, NodeObject n, double dx, double dy) {
			undo_stack.push(new GraphModification(GraphModificationKind.NODE_MOVED, n, new Point2D(dx, dy)));
			redo_stack.clear();
			addHistory();
		}

		@Override
		public void nodeRemoved(Diagram g, NodeObject n) {
			undo_stack.push(new GraphModification(GraphModificationKind.EDGE_REMOVED, n));
			redo_stack.clear();
			addHistory();
		}

		@Override
		public void propertyChangedOnNodeOrEdge(Graph g, int event) {
			// TODO Auto-generated method stub
			
		}
		
	};
	
	public GraphModificationListener getListener() {
		return listener;
	}
	
	Stack<GraphModification> undo_stack = new Stack<GraphModification>();
	Stack<GraphModification> redo_stack = new Stack<GraphModification>();
//	ArrayList<GraphModification> modifyList = new ArrayList<GraphModification>();
	
	public enum GraphModificationKind {NODE_ADDED, EDGE_ADDED, NODE_REMOVED, EDGE_REMOVED, NODE_MOVED};

	private class GraphModification {
		
		private GraphModificationKind kind;
		
		private Object element;
		
		private Point2D pos;
		
		public GraphModification(GraphModificationKind kind, Object element) {
			this.kind = kind;
			this.element = element;
		}
		
		public GraphModification(GraphModificationKind kind, Object element, Point2D pos) {
			this.kind = kind;
			this.element = element;
			this.pos = pos;
		}

	}
	
//	private HistoryManager hm;
	
	public CanvasHistoryManager(Diagram g) {
		graph = g;
//		this.hm = hm;
	}
	
	public void addHistory() {
//		HistoryManager.addHistory();
	}

	
    /*
     * キャプチャー
     */
    public void Capture(GraphModificationKind gmk) {
    	//スタ�?��に積�?
    }
    
    /*
     * 自動キャプチャー開�?
     */
    public void StartCapture() {
    	//リスナ�?を使って自動キャプチャーを開始す�?
    }
    
    /*
     * 自動キャプチャー終�?
     */
    public void StopCapture() {
    	
    }
    
    public void undo() {
    	GraphModification gm = undo_stack.pop();
    	redo_stack.push(gm);
    	/*
    	if(gm.kind == GraphModificationKind.EDGE_ADDED)
    	{
    		graph.removeEdge((Edge)gm.element, false);
    	}
    	else if(gm.kind == GraphModificationKind.EDGE_REMOVED)
    	{
    		graph.addEdgeAtPoints((Edge)gm.element, ((Edge)gm.element).getStart().getId(), ((Edge)gm.element).getEnd().getId(), false);
    	}
    	else if(gm.kind == GraphModificationKind.NODE_ADDED)
    	{
    		graph.removeNode((Node)gm.element, false);
    	}
    	else if(gm.kind == GraphModificationKind.NODE_REMOVED)
    	{
    		graph.addNodeAtPoint((Node)gm.element, ((Node)gm.element).getLocation(), false);
    	}
    	else if(gm.kind == GraphModificationKind.NODE_MOVED)
    	{
    		((Node)gm.element).translate(-gm.pos.x, -gm.pos.y);
    	}
    	*/
    }
    
    public void redo() {
    	GraphModification gm = redo_stack.pop();
    	/*
    	if(gm.kind == GraphModificationKind.EDGE_ADDED)
    	{
    		graph.addEdgeAtPoints((Edge)gm.element, ((Edge)gm.element).getStart().getId(), ((Edge)gm.element).getEnd().getId(), false);
    	}
    	else if(gm.kind == GraphModificationKind.EDGE_REMOVED)
    	{
    		graph.removeEdge((Edge)gm.element, false);
    	}
    	else if(gm.kind == GraphModificationKind.NODE_ADDED)
    	{
    		graph.addNodeAtPoint((Node)gm.element, ((Node)gm.element).getLocation(), false);
    	}
    	else if(gm.kind == GraphModificationKind.NODE_REMOVED)
    	{
    		graph.removeNode((Node)gm.element, false);
    	}
    	else if(gm.kind == GraphModificationKind.NODE_MOVED)
    	{
    		((Node)gm.element).translate(gm.pos.x, gm.pos.y);
    	}
    	*/
    }

}
 