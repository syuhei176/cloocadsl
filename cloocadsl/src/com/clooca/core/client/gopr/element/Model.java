package com.clooca.core.client.gopr.element;

import com.clooca.core.client.gopr.metamodel.MetaModel;

public class Model {
	int id;
	Diagram root;
	
	public Model(MetaModel metamodel) {
//		root = (Diagram) metamodel.getMetaDiagram().getInstance();
	}
	
	public Diagram getRootDiagram() {
		return root;
	}
	
	public void setRootDiagram(Diagram root) {
		this.root = root;
	}

	
}
