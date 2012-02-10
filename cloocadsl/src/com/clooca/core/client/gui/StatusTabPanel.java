package com.clooca.core.client.gui;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.clooca.webutil.client.Console;

public class StatusTabPanel {
	
	private VerticalPanel mainpanel = new VerticalPanel();
	static private TextArea console;
	static private String text;
	private Button clear_button = new Button("Clear");
	
	public enum LogLevel {INFO, WARNNING, ERROR};
	
	public StatusTabPanel() {
//		mainpanel = new TabPanel();
		mainpanel.setStyleName("status_panel");
		console = new TextArea();
		console.setStyleName("terminal");
		console.setHeight("20px");
		text = "";
		clear_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				text = "";
				console.setText("");
			}});
//		mainpanel.add(this.clear_button);
		mainpanel.add(console);
	}
	
	public VerticalPanel getPanel() {
		return mainpanel;
	}
	
	void WriteStatus(String str) {
		console.setText(str);
		Console.log(str);
	}
	
	public static void WriteStatus(LogLevel level, String str) {
		text += str + "\n";
		console.setText(text);
		Console.log(str);
	}

	
	void WriteXML(String str) {
		console.setText(str);
	}
	
	void WriteExeXML(String str) {
		console.setText(str);
	}
	
	void show() {
		console.setHeight("20px");
	}
	
	void hide() {
		
	}
}
 
