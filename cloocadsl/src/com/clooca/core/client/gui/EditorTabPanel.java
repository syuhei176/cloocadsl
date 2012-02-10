package com.clooca.core.client.gui;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.diagram.*;
import com.clooca.core.client.gopr.element.Diagram;
import com.clooca.core.client.gopr.metamodel.MetaModel;
import com.clooca.webutil.client.MyTabPanel;
import com.clooca.webutil.client.MyTabPanel.MyTabPanelListener;

/**
 * @version 1.1
 * @author Syuhei Hiya
 * 
 * version 1.1
 * add function MakeNewEventEditorTab
 * add function openExEvents
 */
public class EditorTabPanel implements MyTabPanelListener {
	
	/**
	 * 
	 */
	static private MyTabPanel mainpanel;
	
	/**
	 * 
	 */
	static private ArrayList<DiagramSelectionListener> listeners;
	
	/**
	 * 
	 */
	static private mdlAbstractEditor current_canvas;

	/**
	 * 
	 */
	static private Diagram pre_diagram;
	
	/**
	 * 
	 */
	static private List<mdlAbstractEditor> editors;
	
	public EditorTabPanel() {
		mainpanel = new MyTabPanel();
		mainpanel.setStyleName("mycanvas_tab");
		mainpanel.addSelectionHandler(this);
		listeners = new ArrayList<DiagramSelectionListener>();
		editors = new ArrayList<mdlAbstractEditor>();
	}
	
	/**
	 * 
	 * @param l
	 */
	static public void addListener(DiagramSelectionListener l) {
		listeners.add(l);
	}

	/**
	 * get main panel
	 * @return
	 */
	static public MyTabPanel getPanel() {
		return mainpanel;
	}
	
	/**
	 * close selected tab
	 * @return
	 */
	static public boolean CloseSelectedTab() {
		CloseTab(mainpanel.getSelectedIndex());
		return true;
	}
	
	/**
	 * 
	 * @param index
	 * @return
	 */
	static private boolean CloseTab(int index) {
		for(DiagramSelectionListener l : listeners) {
			mdlAbstractEditor ae = editors.get(index);
			l.OnCloseOther(ae.getKey());
		}
		mainpanel.remove(index);
		editors.remove(index);
		return true;
	}
	
	/**
	 * create new tabitem that contain editor
	 * @param tabName
	 * @param editor
	 */
	static public void CreateNewTab(String tabName, mdlAbstractEditor editor) {
		for(mdlAbstractEditor e : editors) {
			if(e.getKey() == editor.getKey()) {
				int index = mainpanel.indexOf(editor.getPanel());
				mainpanel.selectTab(index);
			}
		}
		
		mainpanel.addTab(editor.getPanel(), tabName);
		
		int index = mainpanel.indexOf(editor.getPanel());
		
		editors.add(editor);
		current_canvas = editor;
		mainpanel.selectTab(index);
		
	}
	
	/**
	 * 
	 * @return
	 */
	static public mdlCanvas getCurrentCanvas() {
		if(current_canvas instanceof mdlCanvas) {
			return (mdlCanvas)current_canvas;
		}else{
			return null;
		}
	}
	
	/**
	 * 
	 * @return
	 */
	static public mdlAbstractEditor getCurrentEditor() {
		return current_canvas;
	}
	
	/**
	 * 
	 * @return
	 */
	static public List<mdlAbstractEditor> getEditors() {
		return editors;
	}
	
	/**
	 * 
	 */
	static public void clear() {
		mainpanel.clear();
		editors.clear();
	}

	@Override
	public void onSelection(int index) {
		current_canvas = editors.get(index);
		if(current_canvas instanceof mdlCanvas) {
			mdlCanvas current_mdlcanvas = (mdlCanvas)current_canvas;
			if(!current_mdlcanvas.getDiagram().equals(pre_diagram)) {
				for(DiagramSelectionListener l : listeners) {
					l.OnSelectDiagram(current_mdlcanvas.getDiagram());
				}
			}
			pre_diagram = current_mdlcanvas.getDiagram();
		}else{
			
		}
	}

	@Override
	public void onClose(int index) {
		for(DiagramSelectionListener l : listeners) {
			mdlAbstractEditor ae = editors.get(index);
			l.OnCloseOther(ae.getKey());
		}
		editors.remove(index);
	}

}
