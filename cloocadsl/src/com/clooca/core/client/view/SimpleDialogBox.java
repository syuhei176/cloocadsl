package com.clooca.core.client.view;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Widget;

public class SimpleDialogBox extends DialogBox {
	
	/*
	interface CloseHandler {
		public void onClose();
	}
	*/
	
	public SimpleDialogBox(Widget w, String title) {
		this.setTitle(title);
		this.setText(title);
		HorizontalPanel panel = new HorizontalPanel();
		panel.add(w);
		Button close = new Button("閉じる");
		panel.add(close);
		this.setWidget(panel);
		close.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				hide();
			}});
	}
}
