package com.clooca.core.client.view;

import java.util.ArrayList;
import java.util.List;

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
public class EditorTabView {
	
	/**
	 * 
	 */
	static private MyTabPanel mainpanel = new MyTabPanel();
	
	/**
	 * 
	 */
//	static private ArrayList<DiagramSelectionListener> listeners;
	
	/**
	 * 
	 */
	static private AbstractEditor current_canvas;

	
	/**
	 * 
	 */
	static private List<AbstractEditor> editors =  new ArrayList<AbstractEditor>();
	
	public EditorTabView() {
		
	}
	
	static public void init() {
		mainpanel.addSelectionHandler(new MyTabPanelListener(){

			@Override
			public void onSelection(int index) {
				current_canvas = editors.get(index);
			}

			@Override
			public void onClose(int index) {
				editors.remove(index);
			}});
	}
	
	/**
	 * 
	 * @param l
	 */
//	static public void addListener(DiagramSelectionListener l) {
//		listeners.add(l);
//	}

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
//		for(DiagramSelectionListener l : listeners) {
//			AbstractEditor ae = editors.get(index);
//			l.OnCloseOther(ae.getKey());
//		}
		mainpanel.remove(index);
		editors.remove(index);
		return true;
	}
	
	/**
	 * create new tabitem that contain editor
	 * @param tabName
	 * @param editor
	 */
	static public void CreateNewTab(String tabName, AbstractEditor editor) {
/*		for(mdlAbstractEditor e : editors) {
			if(e.getKey() == editor.getKey()) {
				int index = mainpanel.indexOf(editor.getPanel());
				mainpanel.selectTab(index);
			}
		}*/
		
		mainpanel.addTab(editor.getWidget(), tabName);
		
		int index = mainpanel.indexOf(editor.getWidget());
		
		editors.add(editor);
		current_canvas = editor;
		mainpanel.selectTab(index);
		
	}
	
	/**
	 * 
	 * @return
	 */
	static public AbstractEditor getCurrentEditor() {
		return current_canvas;
	}
	
	/**
	 * 
	 * @return
	 */
	static public List<AbstractEditor> getEditors() {
		return editors;
	}
	
	/**
	 * 
	 */
	static public void clear() {
		mainpanel.clear();
		editors.clear();
	}

}
