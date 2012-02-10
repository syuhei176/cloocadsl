package com.clooca.core.client.diagram;

import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.user.client.ui.ListBox;
import com.google.gwt.user.client.ui.Widget;
import com.clooca.core.client.util.*;

public abstract class SuggestPropertyArea extends AbstractPropertyArea implements ChangeHandler {
	
//	private SuggestBox panel;
	private ListBox panel;;
	final static int MARGIN = 12;
	final static int FONT_HEIGHT = 15;
	
	
	public SuggestPropertyArea() {
		
	}
	
	public void init(Object[] objects) {
		panel = new ListBox();
		for(Object str : objects) {
			panel.addItem((String)str);
		}
/*
		panel = new SuggestBox(oracle);
		panel.addEventHandler(new SuggestionHandler(){
			    public void onSuggestionSelected(SuggestionEvent event) {
//			     Window.alert(panel.getText() );
			    }
			      });
			      */
		panel.addChangeHandler(this);
	}
	
	public void addList(String listitem) {
		panel.addItem(listitem);
	}
	
	public String[] getList(String listitem) {
		String[] list = {""};
		for(int i=0;i < panel.getItemCount();i++) {
			list[i] = panel.getItemText(i);
		}
		return list;
	}
	
	public Widget getPanel() {
		return panel;
	}
	
	@Override
	public void onChange(ChangeEvent event) {
		// TODO Auto-generated method stub
		
	}

	public void draw(GraphicManager gm, Rectangle2D r) {
		if(getVisual_type() == VISUAL_TYPE.VISUAL_CASE) {
			gm.DrawTextMultiLine(panel.getItemText(panel.getSelectedIndex()), (int)(r.getX() + MARGIN), (int)r.getY()+FONT_HEIGHT);
		}else if(getVisual_type() == VISUAL_TYPE.VISUAL_LINE) {
			double tx = r.getX() + r.width / 2 - panel.getItemText(panel.getSelectedIndex()).length() / 2;
			double ty = r.getY() + r.height / 2;
			gm.DrawTextMultiLine(panel.getItemText(panel.getSelectedIndex()), (int)(tx), (int)ty);
		}
	}
	
	public Rectangle2D getBound() {
		int max = 0;
		String[] strs = panel.getItemText(panel.getSelectedIndex()).split("\n");
		for(String str : strs) {
			if(max < str.length()) {
				max = str.length();
			}
		}
		return new Rectangle2D(0, 0, max * 6, getHeight());
	}
	
	public int getHeight() {
		return panel.getItemText(panel.getSelectedIndex()).split("\n").length * FONT_HEIGHT;
	}
	
	public String getContent() {
		return panel.getItemText(panel.getSelectedIndex());
	}
	
	public void setContent(String text) {
	      for(int i=0;i < panel.getItemCount();i++) {
	          if(panel.getItemText(i).matches(text)) {
	        	  panel.setSelectedIndex(i);
	        	  break;
	          }
	      }
//		panel.setText(text);
	}

}
 
