package com.clooca.workbench.client;

import com.clooca.webutil.client.CloocaCanvas;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.RootLayoutPanel;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.SimplePanel;

public class WorkBench implements EntryPoint {

	@Override
	public void onModuleLoad() {
		/*
		CloocaIDE ide = new CloocaIDE();
		SimplePanel panel = new SimplePanel();
		panel.add(ide);
		RootPanel.get("body").add(panel);
		*/
       	cloocaIDE mdl = new cloocaIDE();
	}

}
