package com.clooca.core.client.diagram;

import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.clooca.core.client.util.*;

public abstract class TextPropertyArea extends AbstractPropertyArea implements ChangeHandler {
	
	private TextBox panel;
	
	final static int LEFT_MARGIN = 16;
	final static int FONT_HEIGHT = 16;
	final static int FONT_HEIGHT_MARGIN = 6;
	final static int FONT_WIDTH = 10;
	final static int FONT_WIDTH_MARGIN = 1;
	
	public static int font_size = 12;
		
	public TextPropertyArea() {
		super();
		panel = new TextBox();
		panel.addChangeHandler(this);
//		panel.setPixelSize(280, 320);
	}
	
	public Widget getPanel() {
		return panel;
	}
	
	@Override
	public void onChange(ChangeEvent event) {
		
	}
	
	public void addChangeHandler(ChangeHandler ch) {
		panel.addChangeHandler(ch);
	}

	public void draw(GraphicManager gm, Rectangle2D r) {
		if(!visible) return;
		if(getVisual_type() == VISUAL_TYPE.VISUAL_CASE) {
			gm.DrawTextMultiLine(panel.getText(), (int)(r.getX() + LEFT_MARGIN), (int)r.getY()+font_size/*FONT_HEIGHT*/, (int)r.getWidth());
		}else if(getVisual_type() == VISUAL_TYPE.VISUAL_LINE) {
			double tx = r.getX() + r.width / 2 - panel.getText().length() / 2;
//			double tx = r.getX();
			double ty = r.getY() + r.height / 2;
			gm.DrawTextMultiLine(panel.getText(), (int)(tx), (int)ty, (int)r.getWidth());
		}
	}
	
	public Rectangle2D getBound() {
		int max = 0;
		String[] strs = panel.getText().split("\n");
		for(String str : strs) {
			if(max < str.length()) {
				max = str.length();
			}
		}
		return new Rectangle2D(0, 0, max * (font_size * 2 / 3)/*FONT_WIDTH*/ + LEFT_MARGIN, getHeight());
	}
	
	public int getHeight() {
		if(panel.getText() == null) return 0;
		return panel.getText().split("\n").length * (font_size/*FONT_HEIGHT*/ + FONT_HEIGHT_MARGIN);
	}
	
	public String getContent() {
		return panel.getText();
	}
	
	public void setContent(String text) {
		panel.setText(text);
	}
	
}
 
