package com.clooca.core.client.diagram;

import com.clooca.core.client.gopr.element.Diagram;


public interface DiagramSelectionListener {
 
	public abstract void OnSelectDiagram(Diagram diagram);
	public abstract void OnCloseDiagram(Graph g);
	public abstract void OnCloseOther(String key);
}
 
