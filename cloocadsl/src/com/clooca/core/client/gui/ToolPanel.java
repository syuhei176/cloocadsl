package com.clooca.core.client.gui;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.user.client.ui.ToggleButton;
import com.clooca.core.client.diagram.*;
import com.clooca.core.client.gopr.element.Diagram;
import com.clooca.core.client.gopr.metamodel.*;

/**
 * Tool Panel for diagram
 * @author Syuhei Hiya
 *
 */
public class ToolPanel implements DiagramSelectionListener {
 
	private FlowPanel mainpanel;
	
	private List<ToolSelectionListener> listeners = new ArrayList<ToolSelectionListener>();
    
    private Tool[] tools;
    
    private ToggleButton[] buttons;
    
    private ArrayList<Tool> mToolList;
    

	public ToolPanel() {
		mainpanel = new FlowPanel();
		mToolList = new ArrayList<Tool>();

	}
	public FlowPanel getPanel() {
		return mainpanel;
	}
	
	public void CreateToolButton(Diagram g) {
		tools = getTools(g);
		buttons = getToggleButtons(tools);
	}
	
	private Tool[] getTools(Diagram g) {
    	List<MetaObject> nodes = ((MetaDiagram)g.getMetaElement()).getObjectTool();
    	List<MetaRelation> edges = ((MetaDiagram)g.getMetaElement()).getRelationshipTool();
    	int length = nodes.size() + edges.size() + 1;
		Tool[] tools = new Tool[length];
		tools[0] = new Tool("select");
    	for(int i = 0;i < nodes.size();i++) {
       		tools[i+1] = new Tool(nodes.get(i), "class");
    	}
    	for(int i = 0;i < edges.size();i++) {
       		tools[i+nodes.size()+1] = new Tool(edges.get(i), "association1");
    	}
    	return tools;
	}
	
    private ToggleButton[] getToggleButtons(Tool[] tools)
    {
    	ToggleButton[] buttons = new ToggleButton[tools.length];
    	mainpanel.clear();
        for (int i = 0; i < tools.length; i++)
        {
            final Tool aTool = tools[i];
            mToolList.add(aTool);
            final ToggleButton button = new ToggleButton(new Image("images/" + aTool.getLabel() + ".png"));
            button.addClickHandler(new ClickHandler() {
            	
				@Override
				public void onClick(ClickEvent event) {
					setSelectedButton(button);
				}
            
            });
            
            mainpanel.add(button);
            buttons[i] = button;
        }
        return buttons;
    }
    
    public void SelectTool(int i) {
    	setSelectedButton(buttons[i]);
    }
    
    private void setSelectedButton(ToggleButton selectedButton)
    {
        for (int i = 0; i < buttons.length; i++)
        {
        	ToggleButton button = buttons[i];
            if (button != selectedButton)
            {
                button.setDown(false);
            }
            if (button == selectedButton)
            {
                button.setDown(true);
                fireToolChangeEvent(tools[i]);
            }
        }
    }
    
    private void fireToolChangeEvent(Tool tool)
    {
        Iterator<ToolSelectionListener> it = this.listeners.iterator();
        while (it.hasNext())
        {
        	ToolSelectionListener listener = it.next();
            listener.toolSelectionChanged(tool);
        }
    }
    
    public void addListener(ToolSelectionListener listener)
    {
        this.listeners.add(listener);
    }
    
	public interface ToolSelectionListener {
        void toolSelectionChanged(Tool selectedTool);
	}
	
	public class Tool {		
		String label;
		MetaElement ToolKind;

		public Tool(String l) {
			label = l;
			ToolKind = null;
		}

		public Tool(MetaObject n, String l) {
			label = l;
			ToolKind = n;
		}
		
		public Tool(MetaRelation e, String l) {
			label = l;
			ToolKind = e;
		}
		
		public String getLabel() {
			return label;
		}
		
		public MetaElement getToolKind() {
			return ToolKind;
		}
	}
	
	@Override
	public void OnCloseDiagram(Graph g) {
		
	}
	
	@Override
	public void OnCloseOther(String key) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void OnSelectDiagram(Diagram g) {
		CreateToolButton(g);
	}

}
 
