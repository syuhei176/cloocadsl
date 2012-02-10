package com.clooca.core.client.gui;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.MouseDownEvent;
import com.google.gwt.event.dom.client.MouseDownHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.MenuBar;
import com.google.gwt.user.client.ui.MenuItem;
import com.google.gwt.user.client.ui.PopupPanel;
import com.google.gwt.user.client.ui.ScrollPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.ListBox;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.clooca.core.client.diagram.*;
import com.clooca.core.client.mdd.*;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;

public class EventEditor extends Composite implements mdlAbstractEditor,MouseDownHandler {

	private static EventEditorUiBinder uiBinder = GWT
			.create(EventEditorUiBinder.class);
	@UiField Button AddButton;
	@UiField Button remove_button;
	@UiField ListBox event_list;
	@UiField Button button;
	private ScrollPanel mainpanel;
	ExternalEvents exevents;
	String key;
	
	interface EventEditorUiBinder extends UiBinder<Widget, EventEditor> {
	}

	public EventEditor(ExternalEvents exevents, String key) {
		initWidget(uiBinder.createAndBindUi(this));
		createPopupMenu();
		this.key = key;
		mainpanel = new ScrollPanel();
		this.exevents = exevents;
		mainpanel.add(this.asWidget());
		event_list.setSelectedIndex(0);
		for(String _key : this.exevents.getHashMap().keySet()) {
			event_list.addItem(this.exevents.getHashMap().get(_key).getEvent_name());
		}
	    setPanelSize(Window.getClientWidth() - 370, Window.getClientHeight() - 150);
	    // リサイズイベント
	    Window.addResizeHandler(new ResizeHandler() {
	        public void onResize(ResizeEvent ev) {
	            setPanelSize(ev.getWidth() - 370, ev.getHeight() - 150);
	        }
	    });

	}

	@Override
	public void addElementSelectionListener(ElementSelectionListener l) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getName() {
		return "ExternalEvents";
	}

	@Override
	public ScrollPanel getPanel() {
		return mainpanel;
	}

	@Override
	public void setName(String name) {
		// TODO Auto-generated method stub
		
	}

	private EditorTabPanel editorTabPanel;

    final private PopupPanel popupPanel = new PopupPanel(true);

        Command com_close = new Command() {
      	  public void execute() {
      	    popupPanel.hide();
      	    editorTabPanel.CloseSelectedTab();
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
	
	public ExternalEvents getExEvents() {
		return this.exevents;
	}
	
	@UiHandler("AddButton")
	void onAddButtonClick(ClickEvent event) {
		/*
		exevents.add(new ExternalEvent(event_name.getText(), event_target.getText()));
		event_list.addItem(event_name.getText());
		*/
		EventEditorDialog eed = new EventEditorDialog(null);
		eed.show();
		eed.center();

	}
	
	@UiHandler("remove_button")
	void onRemove_buttonClick(ClickEvent event) {
		if(event_list.getSelectedIndex() < 0) return;
		this.exevents.remove(event_list.getItemText(event_list.getSelectedIndex()));
		event_list.removeItem(event_list.getSelectedIndex());
	}
	
	@UiHandler("event_list")
	void onEvent_listChange(ChangeEvent event) {
		/*
		String name = this.event_list.getItemText(event_list.getSelectedIndex());
		ExternalEvent externalevent = exevents.getHashMap().get(name);
		*/
	}
	
	@UiHandler("button")
	void onButtonClick(ClickEvent event) {
		String name = this.event_list.getItemText(event_list.getSelectedIndex());
		ExternalEvent externalevent = exevents.getHashMap().get(name);
		EventEditorDialog eed = new EventEditorDialog(externalevent);
		eed.show();
		eed.center();
	}

	
	public void setPanelSize(int w, int h) {
		mainpanel.setPixelSize(w, h);
	}
	
	@Override
	public Object getResource() {
		return this.exevents;
	}
	
	@Override
	public String getKey() {
		return key;
	}
	
	public class EventEditorDialog extends DialogBox {
		
		ExternalEvent current_event;
		
	    public EventEditorDialog(ExternalEvent event){
	    	super(false, false);
	    	current_event = event;
		    setText("EventEditorDialog");
		    Label eventNameLabel = new Label("EventName");
		    Label eventTargetLabel = new Label("EventTarget");
		    Label eventParamsLabel = new Label("Parameters");
		    final TextBox eventNameTextBox = new TextBox();
		    final TextBox eventTargetTextBox = new TextBox();
		    final TextBox eventParamsTextBox = new TextBox();
	    	if(current_event == null) {	//add mode
	    		
	    	}else{	//edit mode
			    eventNameTextBox.setText(current_event.getEvent_name());
			    eventTargetTextBox.setText(current_event.getTarget_class());
			    eventParamsTextBox.setText(current_event.getParams().convertToString());
	    	}
		    Button okButton = new Button("OK");
		    Button cancelButton = new Button("Cancel");
		    okButton.addClickHandler(new ClickHandler(){
		        @Override
		        public void onClick(ClickEvent event) {
			    	if(current_event == null) {	//add mode
			    		exevents.add(new ExternalEvent(eventNameTextBox.getText(), eventTargetTextBox.getText(), eventParamsTextBox.getText()));
			    		event_list.addItem(eventNameTextBox.getText());
			    	}else{	//edit mode
			        	current_event.setEvent_name(eventNameTextBox.getText());
			        	current_event.setTarget_class(eventTargetTextBox.getText());
			        	current_event.getParams().convert(eventParamsTextBox.getText());
			    	}
		        	hide();
		        }
		    });
		    cancelButton.addClickHandler(new ClickHandler(){
		        @Override
		        public void onClick(ClickEvent event) {
		        	hide();
		        }
		    });
		    VerticalPanel mainpanel = new VerticalPanel();
		    HorizontalPanel hpanel_name = new HorizontalPanel();
		    hpanel_name.add(eventNameLabel);
		    hpanel_name.add(eventNameTextBox);
		    HorizontalPanel hpanel_target = new HorizontalPanel();
		    hpanel_target.add(eventTargetLabel);
		    hpanel_target.add(eventTargetTextBox);
		    HorizontalPanel hpanel_params = new HorizontalPanel();
		    hpanel_params.add(eventParamsLabel);
		    hpanel_params.add(eventParamsTextBox);
		    HorizontalPanel hpanel_button = new HorizontalPanel();
		    hpanel_button.add(okButton);
		    hpanel_button.add(cancelButton);
		    mainpanel.add(hpanel_name);
		    mainpanel.add(hpanel_target);
		    mainpanel.add(hpanel_params);
		    mainpanel.add(hpanel_button);
		    setWidget(mainpanel);
	    }

	}
	
}
