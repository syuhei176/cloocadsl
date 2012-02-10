package com.clooca.webutil.client;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.MouseDownEvent;
import com.google.gwt.event.dom.client.MouseDownHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;

public class MyTabPanel extends Composite {
	
	HorizontalPanel tabpanel = new HorizontalPanel();
	SimplePanel deck = new SimplePanel();
//	HashMap<Integer,Widget> widgetMap = new HashMap<Integer,Widget>();
	List<Widget> widgets = new ArrayList<Widget>();
	List<MyTabPanelListener> listeners;
	int selectedIndex = 0;
	
	public interface MyTabPanelListener {
		public void onSelection(int index);
		public void onClose(int index);
	}
	
	public MyTabPanel() {
		VerticalPanel panel = new VerticalPanel();
		initWidget(panel);
		panel.add(tabpanel);
		panel.add(deck);

//		 tabBar.addSelectionHandler(this);
	}
	
	public void addTab(final Widget w, String tabname) {
//		widgetMap.put(key, w);
//		tabpanel.add(w);
		widgets.add(w);
//		final Integer index = widgets.indexOf(w);
		HorizontalPanel hpanel = new HorizontalPanel();
		Label l = new Label(tabname);
		l.setStyleName("MyTabPanel-TabBar-Item-Label");
		hpanel.add(l);
		Button button = new Button("");
		button.setStyleName("MyTabPanel-TabBar-Item-Close");
		button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				for(MyTabPanelListener sh : listeners) {
					sh.onClose(widgets.indexOf(w));
				}
				remove(widgets.indexOf(w));
			}});
		hpanel.add(button);
		hpanel.setStyleName("MyTabPanel-TabBar-Item");
		tabpanel.add(hpanel);
		l.addMouseDownHandler(new MouseDownHandler(){

			@Override
			public void onMouseDown(MouseDownEvent event) {
				selectTab(widgets.indexOf(w));
			}});
	}
	
	public Widget getTab(int index) {
		return tabpanel.getWidget(index);
	}
	
	public Widget getWidget(int index) {
		return widgets.get(index);
	}
	
	public int indexOf(Widget w) {
		return widgets.indexOf(w);
	}
	
	public void remove(int index) {
		widgets.remove(index);
		tabpanel.remove(index);
		deck.clear();
	}
	
	public void remove(Widget w) {
		int index = widgets.indexOf(w);
		remove(index);
	}

	
	public int getSelectedIndex() {
		return selectedIndex;
	}
	
	public void selectTab(int index) {
		deck.setWidget(widgets.get(index));
		for(int i=0;i < tabpanel.getWidgetCount();i++) {
			tabpanel.getWidget(i).setStyleName("MyTabPanel-TabBar-Item");
		}
		tabpanel.getWidget(index).setStyleName("MyTabPanel-TabBar-Item-Selected");
		selectedIndex = index;
		for(MyTabPanelListener sh : listeners) {
			sh.onSelection(index);
		}
	}
	
	public void clear() {
		if(tabpanel != null) tabpanel.clear();
		if(widgets != null) widgets.clear();
		if(deck != null) deck.clear();
	}
	
	public void addSelectionHandler(MyTabPanelListener handler) {
		if(listeners == null) {
			listeners = new ArrayList<MyTabPanelListener>();
		}
		listeners.add(handler);
	}
	
	class MyTabBar {
		
	}

}
