package com.clooca.core.client.workbench.view;

import com.clooca.core.client.view.AbstractEditor;
import com.google.gwt.user.client.ui.ScrollPanel;

public class MetaElementListEditor extends AbstractEditor {
	
	ScrollPanel mainpanel = new ScrollPanel();
	
	public MetaElementListEditor() {
		this.initEditor(mainpanel, "MetaElement", "metaelement");
	}
}
