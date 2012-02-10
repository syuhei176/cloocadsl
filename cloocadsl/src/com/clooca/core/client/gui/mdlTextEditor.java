package com.clooca.core.client.gui;

import com.google.gwt.event.dom.client.MouseDownEvent;
import com.google.gwt.event.dom.client.MouseDownHandler;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.MenuBar;
import com.google.gwt.user.client.ui.MenuItem;
import com.google.gwt.user.client.ui.PopupPanel;
import com.google.gwt.user.client.ui.ScrollPanel;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.clooca.core.client.diagram.ElementSelectionListener;

/**
 * 
 * @author Syuhei Hiya
 * @version 1
 *
 */
public class mdlTextEditor implements mdlAbstractEditor,MouseDownHandler {
	
	TextArea textArea;
	
	private ScrollPanel mainpanel;
	
	FileTreeItem content;
	
	String key;

	public mdlTextEditor(FileTreeItem code, String key) {
		this.key = key;
		content = code;
		
		textArea = new TextArea();
		/*
		codeArea.addChangeHandler(new ChangeHandler(){
			@Override
			public void onChange(ChangeEvent event) {
				content.setContent(codeArea.getText());
			}});
			*/
		textArea.setText(content.getContent());
		mainpanel = new ScrollPanel();
//		mainpanel.setSize("100%", "100%");
		textArea.setSize((Window.getClientWidth())-360+"px", "320px");
//		codeArea.addMouseDownHandler(this);
		VerticalPanel vp = new VerticalPanel();
		vp.add(textArea);
		mainpanel.add(vp);
		createPopupMenu();
	}	
	
	public ScrollPanel getPanel() {
		return mainpanel;
	}
	
	public String getCode() {
		return textArea.getText();
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
		content.setContent(textArea.getText());
		return content;
	}

	@Override
	public String getKey() {
		return key;
	}
	
}
