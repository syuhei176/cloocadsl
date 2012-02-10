package com.clooca.core.client.util;

import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Frame;
import com.google.gwt.user.client.ui.VerticalPanel;

public class CodeArea extends Composite {
	
	CodeAreaConfig configuration;
	Frame frame;
	
    public CodeArea(CodeAreaConfig configuration) {
        super();
        this.configuration = configuration;
        initWidget();
    }
    
    private void initWidget() {
        VerticalPanel panel = new VerticalPanel();
//        panel.setWidth(configuration.getWidth());
//        panel.setStyleName("codemirror-ed");
        frame = new Frame();
        DOM.setElementAttribute(frame.getElement(), "id", configuration.getId());
//        panel.add(getToolbar());
        panel.add(frame);
        initWidget(panel);
    }
    
    public native void init() /*-{
    	$doc.getElementById('codearea').contentDocument.designMode = "on";
    }-*/;
    
    public native void changecolor(String color) /*-{
		$doc.getElementById('codearea').contentDocument.execCommand('forecolor', false, color);
	}-*/;
    
    public native void changebg(String color) /*-{
		$doc.getElementById('codearea').contentDocument.execCommand('backcolor', false, color);
	}-*/;
    
    public native void addtext(String text) /*-{
		$doc.getElementById('codearea').contentDocument.innerHTML += text;
	}-*/;
    
    public void update() {
    	GWT.log(getText());
    	String str = getText();
//    	for(int i=0;i < str.length();i++) {
    	int i=0;
    	int length = str.length();
    	while(i < length){
    		char c = str.charAt(i);
        	if(c == 'i') {
        		i++;
        		if(str.charAt(i) == 'f') {
        			i++;
//        			changecolor("blue");
                	addtext("<font color='blue'>if</font>");
 //       			changecolor("black");
        			continue;
        		}
        	}else{
        		
        	}
        	addtext(String.valueOf(c));
        	i++;
        	if(i >= length) break;
    	}
//		$doc.getElementById('codearea').contentDocument.execCommand('backcolor', false, color);
	}
    
    public void setText(String text) {
    	frame.getElement().setInnerText(text);
    }
    
    public native String getText() /*-{
		return "aaaifaaa";
	}-*/;
    
}
