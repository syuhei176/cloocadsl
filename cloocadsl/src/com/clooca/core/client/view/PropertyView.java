package com.clooca.core.client.view;

import java.util.List;

import com.clooca.core.client.model.gopr.element.Diagram;
import com.clooca.core.client.model.gopr.element.NodeObject;
import com.clooca.core.client.model.gopr.element.Relationship;
import com.clooca.core.client.model.gopr.element.Property;
import com.clooca.core.client.model.gopr.metaelement.MetaObject;
import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
import com.clooca.core.client.model.gopr.metaelement.MetaRelation;
import com.clooca.core.client.util.ElementSelectionListener;
import com.clooca.core.client.util.IdGenerator;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.ListBox;
import com.google.gwt.user.client.ui.TabPanel;
import com.google.gwt.user.client.ui.TextBox;

public class PropertyView {
	static TabPanel mainpanel = new TabPanel();
	 	
	public PropertyView() {
	    Window.addResizeHandler(new ResizeHandler() {
	        public void onResize(ResizeEvent ev) {
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
	
//	public static DiagramSelectionListener GetDiagramSelectionListener() {
//		return dslistener;
		
//	}

	/*
	static DiagramSelectionListener dslistener = new DiagramSelectionListener(){
		
		@Override
		public void OnSelectDiagram(Diagram g) {
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
	*/
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
				} else if(o instanceof MetaObject) {
					MetaObject mo = (MetaObject)o;
					ChangePropertyArea(mo);
				} else if(o instanceof MetaRelation) {
					MetaRelation mr = (MetaRelation)o;
					ChangePropertyArea(mr);
				}else{
					/*
					 * unknown object error
					 */
				}
			}
		}};
		
	public static void Clear() {
		mainpanel.clear();
	}
	
	static private void ChangePropertyArea(Relationship obj) {
		mainpanel.clear();
		int tmp = 0;
		for(MetaProperty mp : obj.meta.getProperties()) {
			if(mp.widget.matches(MetaProperty.INPUT_FIELD)) {
				final TextBox tb = new TextBox();
				final Property property = obj.properties.get(tmp);
				tb.addChangeHandler(new ChangeHandler(){

					@Override
					public void onChange(ChangeEvent event) {
						property.setContent(tb.getText());
					}});
				mainpanel.add(tb, mp.getName());
			}else if(mp.widget.matches(MetaProperty.FIXED_LIST)) {
				final ListBox lb = new ListBox();
//				for(String str : mp.getPullDownList()) {
//					lb.addItem(str);
//				}
				final com.clooca.core.client.model.gopr.element.Property property = obj.properties.get(tmp);
				lb.addChangeHandler(new ChangeHandler(){

					@Override
					public void onChange(ChangeEvent event) {
						property.setContent(lb.getItemText(lb.getSelectedIndex()));
					}});
				mainpanel.add(lb, mp.getName());
			}
			tmp++;
		}
	}
	
	static private void ChangePropertyArea(NodeObject obj) {
		mainpanel.clear();
		int tmp = 0;
		for(MetaProperty mp : obj.meta.getProperties()) {
			if(mp.widget.matches(MetaProperty.INPUT_FIELD)) {
				final TextBox tb = new TextBox();
				if(obj.properties.size() <= tmp) {
					Property p = new Property();
					p.id = IdGenerator.getNewLongId();
					p.meta = mp;
					obj.properties.add(p);
				}else{
				}

				final Property property = obj.properties.get(tmp);
				
				tb.setText(property.getContent());
				tb.addChangeHandler(new ChangeHandler(){

					@Override
					public void onChange(ChangeEvent event) {
						property.setContent(tb.getText());
					}});
				mainpanel.add(tb, mp.getName());
			}else if(mp.widget.matches(MetaProperty.FIXED_LIST)) {
				final ListBox lb = new ListBox();
//				for(String str : mp.getPullDownList()) {
//					lb.addItem(str);
//				}
				final com.clooca.core.client.model.gopr.element.Property property = obj.properties.get(tmp);
				lb.addChangeHandler(new ChangeHandler(){

					@Override
					public void onChange(ChangeEvent event) {
						property.setContent(lb.getItemText(lb.getSelectedIndex()));
					}});
				mainpanel.add(lb, mp.getName());
			}
			tmp++;
		}
	}

	static private void ChangePropertyArea(final MetaObject obj) {
		mainpanel.clear();
		final TextBox nTextBox = new TextBox();
		final TextBox gTextBox = new TextBox();
		nTextBox.setText(obj.name);
		nTextBox.addChangeHandler(new ChangeHandler(){

			@Override
			public void onChange(ChangeEvent event) {
				obj.name = nTextBox.getText();
			}
			});
		gTextBox.setText(obj.graphic.shape);
		gTextBox.addChangeHandler(new ChangeHandler(){

			@Override
			public void onChange(ChangeEvent event) {
				obj.graphic.shape = gTextBox.getText();
			}
			});
		mainpanel.add(nTextBox, "name");
		mainpanel.add(gTextBox, "graphic");
	}
	
	static private void ChangePropertyArea(final MetaRelation rel) {
		mainpanel.clear();
		final TextBox nTextBox = new TextBox();
		final TextBox gTextBox = new TextBox();
		nTextBox.setText(rel.name);
		nTextBox.addChangeHandler(new ChangeHandler(){

			@Override
			public void onChange(ChangeEvent event) {
				rel.name = nTextBox.getText();
			}
			});
		/*
		gTextBox.setText(obj.graphic.shape);
		gTextBox.addChangeHandler(new ChangeHandler(){

			@Override
			public void onChange(ChangeEvent event) {
				obj.graphic.shape = gTextBox.getText();
			}
			});
		*/
		mainpanel.add(nTextBox, "name");
//		mainpanel.add(gTextBox, "graphic");
	}

}
