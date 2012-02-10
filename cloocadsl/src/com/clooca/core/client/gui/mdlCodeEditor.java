package com.clooca.core.client.gui;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.MouseDownEvent;
import com.google.gwt.event.dom.client.MouseDownHandler;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.MenuBar;
import com.google.gwt.user.client.ui.MenuItem;
import com.google.gwt.user.client.ui.PopupPanel;
import com.google.gwt.user.client.ui.ScrollPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.clooca.core.client.diagram.ElementSelectionListener;
import com.clooca.core.client.mdd.*;
import com.clooca.core.client.util.*;

/**
 * 
 * @author Syuhei Hiya
 * @version 1
 *
 */
public class mdlCodeEditor implements mdlAbstractEditor,MouseDownHandler {
	
	CodeArea codeArea;
	
	private ScrollPanel mainpanel;

	etUMLAction content;
	
	String key;

	public mdlCodeEditor(etUMLAction code, String key) {
		this.key = key;
		content = code;
		
		codeArea = new CodeArea(new CodeAreaConfig());
		/*
		codeArea.addChangeHandler(new ChangeHandler(){
			@Override
			public void onChange(ChangeEvent event) {
				content.setContent(codeArea.getText());
			}});
			*/
		codeArea.setText(code.getContent());
		mainpanel = new ScrollPanel();
//		mainpanel.setSize("100%", "100%");
		codeArea.setSize("100%", "320px");
//		codeArea.addMouseDownHandler(this);
		VerticalPanel vp = new VerticalPanel();
		vp.add(codeArea);
		{
			Button button = new Button("edit");
			button.addClickHandler(new ClickHandler(){
				@Override
				public void onClick(ClickEvent event) {
					codeArea.init();
				}});
			vp.add(button);
		}
		{
			Button button = new Button("update");
			button.addClickHandler(new ClickHandler(){
				@Override
				public void onClick(ClickEvent event) {
					codeArea.update();
				}});
			vp.add(button);
		}
		{
			Button button = new Button("bg");
			button.addClickHandler(new ClickHandler(){
				@Override
				public void onClick(ClickEvent event) {
					codeArea.changebg("black");
				}});
			vp.add(button);
		}

		mainpanel.add(vp);
		createPopupMenu();
	}	
	
	public ScrollPanel getPanel() {
		return mainpanel;
	}
	
	public String getCode() {
		return codeArea.getText();
	}

	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setName(String name) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void addElementSelectionListener(ElementSelectionListener l) {
		// TODO Auto-generated method stub
		
	}
	
    final private PopupPanel popupPanel = new PopupPanel(true);

        Command com_close = new Command() {
      	  public void execute() {
      	    popupPanel.hide();
      	    EditorTabPanel.CloseSelectedTab();
      	  }
      	};

    	
    private void createPopupMenu() {
    	  MenuBar popupMenuBar = new MenuBar(true);
    	  MenuItem closeItem = new MenuItem("閉じる", true, com_close);
    	 
    	  popupPanel.setStyleName("contextmenu");
    	  closeItem.addStyleName("contextmenu_item");
    	 
    	  popupMenuBar.addItem(closeItem);
    	 
    	  popupMenuBar.setVisible(true);
    	  popupPanel.add(popupMenuBar);
    }
    
	@Override
	public void onMouseDown(MouseDownEvent event) {
		if(DOM.eventGetButton(DOM.eventGetCurrentEvent())==Event.BUTTON_RIGHT){
			  int x = DOM.eventGetClientX(DOM.eventGetCurrentEvent());
			  int y = DOM.eventGetClientY(DOM.eventGetCurrentEvent());
			  popupPanel.setPopupPosition(x, y);
			  popupPanel.show();
			  return;
		}
	}

	@Override
	public Object getResource() {
		return this.codeArea.getText();
	}

	@Override
	public String getKey() {
		return key;
	}
	
}
