package com.clooca.core.client.gui;

import com.google.gwt.user.client.ui.ScrollPanel;
import com.clooca.core.client.diagram.ElementSelectionListener;

/**
 * 
 * @author Syuhei Hiya
 * @version 1
 *
 */
public interface mdlAbstractEditor {
	abstract public ScrollPanel getPanel();
	abstract public void setName(String name);
	abstract public String getName();
	abstract public String getKey();
	abstract public void addElementSelectionListener(ElementSelectionListener l);
	abstract public Object getResource();
}
