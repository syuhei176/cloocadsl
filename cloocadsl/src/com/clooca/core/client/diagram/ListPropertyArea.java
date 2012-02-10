package com.clooca.core.client.diagram;

import java.util.ArrayList;

import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.TextArea;
import com.clooca.core.client.util.*;

public abstract class ListPropertyArea extends AbstractPropertyArea implements ChangeHandler {
	
	protected int num;
	
	protected FlowPanel panel;
	
	protected ArrayList<TextArea> textAreas = new ArrayList<TextArea>();
	/*
	static int LEFT_MARGIN = 12;
	static int FONT_HEIGHT = 15;
	static int FONT_HEIGHT_MARGIN = 2;
	static int FONT_WIDTH = 8;//6?
	static int FONT_WIDTH_MARGIN = 1;
	*/
	final static int LEFT_MARGIN = 16;
	final static int FONT_HEIGHT = 16;
	final static int FONT_HEIGHT_MARGIN = 6;
	final static int FONT_WIDTH = 10;
	final static int FONT_WIDTH_MARGIN = 1;

	public ListPropertyArea() {
		super();
		TextArea ta = new TextArea();
		ta.addChangeHandler(this);
		textAreas.add(ta);
		panel = new FlowPanel();
	}
	public int getNumOfList() {
		return num;
	}
	
	public ArrayList<TextArea> getTextAreas() {
		return textAreas;
	}
	
	public void addTextAreas(String text) {
		TextArea new_ta = new TextArea();
		new_ta.setText(text);
		new_ta.addChangeHandler(this);
		textAreas.add(new_ta);
		panel.add(new_ta);
	}
	
	public ArrayList<String> getStrings() {
		ArrayList<String> strlist = new ArrayList<String>();
		for(TextArea ta : textAreas) {
			if(ta.getText().isEmpty() || ta.getText().length() == 0) {
				
			}else{
				strlist.add(ta.getText());
			}
		}
		return strlist;
	}
	
	@Override
	public void onChange(ChangeEvent event) {
		ArrayList<TextArea> tmp = new ArrayList<TextArea>();
		ArrayList<TextArea> removelist = new ArrayList<TextArea>();
		
		for(TextArea ta : textAreas) {
			if(ta.getText().isEmpty() || ta.getText().length() == 0) {
				removelist.add(ta);
			}else {
				String[] strlist = ta.getText().split("\n");
				ta.setText(strlist[0]);
				for(int i = 1; i < strlist.length;i++) {
					TextArea new_ta = new TextArea();
					new_ta.setText(strlist[i]);
					new_ta.addChangeHandler(this);
					tmp.add(new_ta);
				}
			}
		}
		for(TextArea ta : tmp) {
			textAreas.add(ta);
			panel.add(ta);
		}
		for(TextArea ta : removelist) {
			textAreas.remove(ta);
			panel.remove(ta);
		}
		if(textAreas.size() == 0) {
			TextArea new_ta = new TextArea();
			new_ta.setText("");
			new_ta.addChangeHandler(this);
			textAreas.add(new_ta);
		}
	}
	
	public FlowPanel getPanel() {
		panel.clear();
		for(TextArea ta : textAreas) {
			panel.add(ta);
		}
		return panel;
	}
	
	public void draw(GraphicManager gm, Rectangle2D r) {
		int y = 0;
		for(TextArea ta : textAreas) {
			gm.DrawText(ta.getText(), (int)(r.getX() + LEFT_MARGIN), (int)r.getY() + y + FONT_HEIGHT, (int)r.getWidth());
			y += FONT_HEIGHT + FONT_HEIGHT_MARGIN;
		}
	}
	
	public Rectangle2D getBound() {
		int max = 0;
		for(TextArea ta : textAreas) {
			if(max < ta.getText().length()) {
				max = ta.getText().length();
			}
		}
		return new Rectangle2D(0, 0, max * FONT_WIDTH + LEFT_MARGIN, getHeight());
	}

	public int getHeight() {
		return textAreas.size() * (FONT_HEIGHT + FONT_HEIGHT_MARGIN);
	}

}
 
