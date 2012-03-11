package com.clooca.core.client.model.gopr.element;

import com.clooca.core.client.model.gopr.metaelement.MetaModel;

public class Model {
	public int id;
	public Diagram root;
	
	public Model() {
//		root = (Diagram) metamodel.getMetaDiagram().getInstance();
	}
	
	public Diagram getRootDiagram() {
		return root;
	}
	
	public void setRootDiagram(Diagram root) {
		this.root = root;
	}

	
}
