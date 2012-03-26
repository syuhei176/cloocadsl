package com.clooca.core.client.workbench.view;

import com.clooca.core.client.model.gopr.metaelement.MetaModel;
import com.clooca.core.client.view.AbstractEditor;
import com.clooca.core.client.workbench.presenter.WorkbenchController;

public class MetaElementEditor extends AbstractEditor {
	
	public MetaElementEditor(WorkbenchController controller) {
		super();
		initEditor(new MetaElementManager(controller.getMetaModel()).asWidget(), "metamodel", "metamodel");
	}
}
