package com.clooca.core.client.gui;

import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.TabPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.clooca.core.client.diagram.*;
import com.clooca.core.client.gopr.element.Diagram;
import com.clooca.core.client.gopr.element.NodeObject;
import com.clooca.core.client.gopr.element.Relationship;
import com.clooca.core.client.gopr.metamodel.MetaElement;
import com.clooca.core.client.gopr.metamodel.MetaModel;
import com.clooca.core.client.gopr.metamodel.MetaProperty;
import com.clooca.core.client.gopr.metamodel.MetaRelation;
import com.clooca.core.client.gopr.metamodel.MetaObject;

public class PropertyPanel {
 
//	private HTMLPanel mainpanel;
	static TabPanel mainpanel = new TabPanel();

	static private AbstractPropertyArea CurrentPropertyArea;
	
	static private Diagram current_graph;
	 	
	public PropertyPanel() {
//		mainpanel = new HTMLPanel();
	    Window.addResizeHandler(new ResizeHandler() {
	        public void onResize(ResizeEvent ev) {
//	            mainpanel.setWidth((ev.getWidth() - 32) + "px");
	            mainpanel.setPixelSize(ev.getWidth() - 32, 150);
	        }
	    });
	}
	
	static public TabPanel getpanel() {
		return mainpanel;
	}
	
	public static ElementSelectionListener GetElementSelectionListener() {
		return eslistener;
		
	}
	
	public static DiagramSelectionListener GetDiagramSelectionListener() {
		return dslistener;
		
	}

	static DiagramSelectionListener dslistener = new DiagramSelectionListener(){
		
		@Override
		public void OnSelectDiagram(Diagram g) {
			current_graph = g;
			Clear();
		}

		@Override
		public void OnCloseDiagram(Graph g) {
			// TODO Auto-generated method stub
			
		}

		@Override
		public void OnCloseOther(String key) {
			// TODO Auto-generated method stub
			
		}};
	
	static ElementSelectionListener eslistener = new ElementSelectionListener(){

		@Override
		public void OnSelectElement(Object o) {
			if(o != null) {
				Clear();
				if(o instanceof Relationship) {
					Relationship r = (Relationship)o;
					ChangePropertyArea(r);
				} else if(o instanceof NodeObject) {
					NodeObject no = (NodeObject)o;
					ChangePropertyArea(no);
				} else if(o instanceof CircleNode) {
					CircleNode cn = (CircleNode)o;
//					ChangePropertyArea(cn.getPropertyArea());
				}
			}
		}};
		
	public static void Clear() {
		mainpanel.clear();
	}
	
	static private void ChangePropertyArea(final Relationship r) {
		mainpanel.clear();
		int tmp = 0;
		for(MetaProperty mp : ((MetaRelation)r.getMetaElement()).getProperties()) {
			if(mp.getType().matches("text")) {
				final TextBox tb = new TextBox();
				final com.clooca.core.client.gopr.element.Property property = r.getProperty().get(tmp);
				tb.addChangeHandler(new ChangeHandler(){

					@Override
					public void onChange(ChangeEvent event) {
						property.setContent(tb.getText());
					}});
				mainpanel.add(tb, mp.getName());
				tmp++;
			}
		}
	}
	
	static private void ChangePropertyArea(final NodeObject r) {
		mainpanel.clear();
		int tmp = 0;
		for(MetaProperty mp : ((MetaObject)r.getMetaElement()).getProperties()) {
			if(mp.getType().matches("text")) {
				final TextBox tb = new TextBox();
				final com.clooca.core.client.gopr.element.Property property = r.getProperty().get(tmp);
				tb.addChangeHandler(new ChangeHandler(){

					@Override
					public void onChange(ChangeEvent event) {
						property.setContent(tb.getText());
					}});
				mainpanel.add(tb, mp.getName());
				tmp++;
			}
		}
	}

	
	static private void CreateLayout(TabPanel w, AbstractPropertyArea[] propertyAreas) {
		if(propertyAreas == null) return;
		for(AbstractPropertyArea p : propertyAreas) {
			if(p instanceof StackPropertyArea) {
				/*
//				StackLayoutPanel new_w = new StackLayoutPanel(Unit.EX);
				TabLayoutPanel new_w = new TabLayoutPanel(1.5, Unit.EM);
				new_w.selectTab(((StackPropertyArea)p).getDefaultSelectedTabIndex());
				w.add(new_w, p.getName());
//				w.add(new_w, new HTML(p.getName()), 2.5);
				CreateLayout(new_w, p.getProtoType());
				*/
			}else if(p instanceof ListPropertyArea) {
				ListPropertyArea lpa = (ListPropertyArea)p;
				w.add(lpa.getPanel(), p.getName());
//				w.add(lpa.getPanel(), new HTML(p.getName()), 2.5);
			}else if(p instanceof TextPropertyArea) {
				TextPropertyArea tpa = (TextPropertyArea)p;
				w.add(tpa.getPanel(), p.getName());
//				w.add(tpa.getPanel(), new HTML(p.getName()), 2.5);
			}else if(p instanceof CodePropertyArea) {
				CodePropertyArea tpa = (CodePropertyArea)p;
				w.add(tpa.getPanel(), p.getName());
			}else if(p instanceof SuggestPropertyArea) {
				SuggestPropertyArea tpa = (SuggestPropertyArea)p;
				w.add(tpa.getPanel(), p.getName());
//				w.add(tpa.getPanel(), new HTML(p.getName()), 2.5);
			}
		}
	}
	
}
 
