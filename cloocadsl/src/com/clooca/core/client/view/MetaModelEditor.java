package com.clooca.core.client.view;

import java.util.List;

import com.clooca.core.client.model.gopr.element.Diagram;
import com.clooca.core.client.model.gopr.element.NodeObject;
import com.clooca.core.client.model.gopr.element.Property;
import com.clooca.core.client.model.gopr.element.Relationship;
import com.clooca.core.client.model.gopr.metaelement.Binding;
import com.clooca.core.client.model.gopr.metaelement.MetaModel;
import com.clooca.core.client.model.gopr.metaelement.MetaObject;
import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
import com.clooca.core.client.model.gopr.metaelement.MetaRelation;
import com.clooca.core.client.presenter.DiagramController;
import com.clooca.core.client.presenter.MetaModelController;
import com.clooca.core.client.util.GraphicManager;
import com.clooca.core.client.util.Point2D;
import com.clooca.core.client.util.Rectangle2D;
import com.clooca.core.client.view.DiagramEditor.Tool;
import com.clooca.core.client.workbench.view.PropertiesSettingPanel;
import com.clooca.core.client.workbench.view.PropertySettingPanel;
import com.google.gwt.canvas.client.Canvas;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.DoubleClickEvent;
import com.google.gwt.event.dom.client.DoubleClickHandler;
import com.google.gwt.event.dom.client.MouseDownEvent;
import com.google.gwt.event.dom.client.MouseDownHandler;
import com.google.gwt.event.dom.client.MouseMoveEvent;
import com.google.gwt.event.dom.client.MouseMoveHandler;
import com.google.gwt.event.dom.client.MouseUpEvent;
import com.google.gwt.event.dom.client.MouseUpHandler;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.user.client.ui.MenuBar;
import com.google.gwt.user.client.ui.MenuItem;
import com.google.gwt.user.client.ui.PopupPanel;
import com.google.gwt.user.client.ui.ScrollPanel;
import com.google.gwt.user.client.ui.ToggleButton;
import com.google.gwt.user.client.ui.Widget;

/**
 * 
 * @author Syuhei Hiya
 * View : Diagram Editor
 *
 */
public class MetaModelEditor extends AbstractEditor implements MouseDownHandler,MouseUpHandler,MouseMoveHandler,ClickHandler, DoubleClickHandler {
	MetaModel metamodel;
	private MetaModelController mMetaModelController;
	
	private Canvas canvas;
	
	private FlowPanel toolpanel = new FlowPanel();
	
    private ToggleButton[] buttons;
    private Tool[] tools;
    int selected_tool = 0;
	
	private Point2D mouse = new Point2D(0, 0);
	
	private static final int CANVAS_WIDTH = 1200;
	private static final int CANVAS_HEIGHT = 1200;
	
	/**
	 * popup menu
	 */
    private PopupPanel popupPanel = new PopupPanel(true);
    
    /**
     * 
     * @param c
     * @param mc
     */
    public MetaModelEditor(MetaModelController c) {
    	super();
    	this.mMetaModelController = c;
    	this.metamodel = c.getMetaModel();
    	/*
    	this.metamodeltables = c.getMetaModelTables();
    	this.modeltables = c.getModelTables();
    	*/
    	initEditor(init(), "diagram", "diageam");
    }
    
	private Widget init() {
		canvas = Canvas.createIfSupported();
		canvas.setCoordinateSpaceWidth(CANVAS_WIDTH);
		canvas.setCoordinateSpaceHeight(CANVAS_HEIGHT);
		canvas.addClickHandler(this);
		canvas.addDoubleClickHandler(this);
/*
 * タブレットへの対応
 */
//		if(PlatformDetecter.getOs().matches("Win32")) {
		canvas.addMouseDownHandler(this);
		canvas.addMouseUpHandler(this);
		canvas.addMouseMoveHandler(this);
//		}else{
			/*
		    c.addTouchStartHandler(touchStartHandler);
		    c.addTouchMoveHandler(touchMoveHandler);
		    c.addTouchEndHandler(touchEndHandler);
		    c.addTouchCancelHandler(touchCancelHandler);
		    */
//		}
		HorizontalPanel hpanel = new HorizontalPanel();
		ScrollPanel scrollpanel = new ScrollPanel();
		scrollpanel.add(canvas);
		scrollpanel.setSize("640px", "480px");
		hpanel.add(scrollpanel);
		hpanel.add(toolpanel);
		createButton();
		return hpanel;
	}

	private void createButton() {
		buttons = new ToggleButton[3];
		final ToggleButton sel_button = new ToggleButton(new Image("images/select.png"));
		sel_button.addClickHandler(new ClickHandler() {
        	
			@Override
			public void onClick(ClickEvent event) {
				setSelectedButton(sel_button);
			}
        });
        toolpanel.add(sel_button);

		final ToggleButton button = new ToggleButton(new Image("images/class.png"));
            button.addClickHandler(new ClickHandler() {
            	
    			@Override
    			public void onClick(ClickEvent event) {
    				setSelectedButton(button);
    			}
            });
            toolpanel.add(button);
    		final ToggleButton button2 = new ToggleButton(new Image("images/association1.png"));
            button2.addClickHandler(new ClickHandler() {
            	
    			@Override
    			public void onClick(ClickEvent event) {
    				setSelectedButton(button2);
    			}
            });
            toolpanel.add(button2);
            buttons[0] = sel_button;
            buttons[1] = button;
            buttons[2] = button2;	}
	
	private void setSelectedButton(ToggleButton button) {
    	for(int i = 0;i < buttons.length;i++) {
			if(buttons[i].equals(button)) {
				buttons[i].setDown(true);
				selected_tool = i;
			}else{
				buttons[i].setDown(false);
			}
		}
	}
	
	@Override
	public void onDoubleClick(DoubleClickEvent event) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onClick(ClickEvent event) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onMouseMove(MouseMoveEvent event) {
		mouse.x = event.getX();
		mouse.y = event.getY();
		mMetaModelController.moveAction(mouse.x, mouse.y);
		draw();
	}

	@Override
	public void onMouseUp(MouseUpEvent event) {
		mouse.x = event.getX();
		mouse.y = event.getY();
		mMetaModelController.upAction(mouse.x, mouse.y, selected_tool);
		draw();
		setSelectedButton(this.buttons[0]);
	}

	@Override
	public void onMouseDown(MouseDownEvent event) {
		mouse.x = event.getX();
		mouse.y = event.getY();
		/*
		 * popup menuを出す
		 */
		if(DOM.eventGetButton(DOM.eventGetCurrentEvent())==Event.BUTTON_RIGHT){
			  int x = DOM.eventGetClientX(DOM.eventGetCurrentEvent());
			  int y = DOM.eventGetClientY(DOM.eventGetCurrentEvent());
			  createPopupMenu();
			  popupPanel.setPopupPosition(x, y);
			  popupPanel.show();
			  return;
		}
		mMetaModelController.downAction(mouse.x, mouse.y, selected_tool);
		draw();
	}
	
    Command com_close = new Command() {
    	  public void execute() {
    	    popupPanel.hide();

    	  }
    	};

        Command com_property = new Command() {
      	  public void execute() {
      	    popupPanel.hide();
        	  if(mMetaModelController.getSelected() instanceof MetaObject) {
        		  MetaObject mo = (MetaObject)mMetaModelController.getSelected();
          		SimpleDialogBox db = new SimpleDialogBox(new PropertiesSettingPanel(mo.properties), "setting");
          		db.show();
          		db.center();
        	  }
      	  }
      	};
    private void createPopupMenu() {
    	popupPanel.clear();
    	MenuBar popupMenuBar = new MenuBar(true);
    	MenuItem closeItem = new MenuItem("閉じる", true, com_close);
    	MenuItem propertyItem = new MenuItem("プロパティ", true, com_property);
  	    
    	popupPanel.setStyleName("contextmenu");
    	closeItem.addStyleName("contextmenu_item");
    	propertyItem.addStyleName("contextmenu_item");
    	popupMenuBar.addItem(closeItem);
    	popupMenuBar.addItem(propertyItem);
    	

    	popupMenuBar.setVisible(true);
    	popupPanel.add(popupMenuBar);
    }
    
    public void draw() {
    	GraphicManager gm = new GraphicManager(canvas.getContext2d());
    	gm.clearRect(new Rectangle2D(0,0,CANVAS_WIDTH,CANVAS_HEIGHT));
    	for(MetaObject obj : this.metamodel.meta_diagram.meta_objects) {
    		draw(gm, obj);
    	}
    	for(MetaRelation rel : this.metamodel.meta_diagram.meta_relations) {
    		draw(gm, rel);
    	}
    }
    
    public void draw(GraphicManager gm, MetaObject obj) {
		gm.beginPath();
		gm.setColor("BLACK");
		if(this.mMetaModelController.getSelected() != null && this.mMetaModelController.getSelected().equals(obj)) gm.setColor("BLUE");
		gm.DrawText(obj.name, (int)obj.pos.x+4, (int)obj.pos.y+20-4, 100);
		gm.DrawText(obj.graphic.shape, (int)obj.pos.x+4, (int)obj.pos.y+40-4, 100);
		Rectangle2D bound = new Rectangle2D(obj.pos.x, obj.pos.y, 60, 40);
		gm.StrokeRect(bound);
		gm.stroke();
		gm.closePath();
    }
    
    public void draw(GraphicManager gm, MetaRelation meta_rel) {
		for(Binding b : meta_rel.bindings) {
    		gm.beginPath();
    		gm.setColor("BLACK");
    		if(this.mMetaModelController.getSelected() != null && this.mMetaModelController.getSelected().equals(meta_rel)) gm.setColor("BLUE");
    		if(b.src.id == b.dest.id) {
        		gm.moveTo(b.src.pos);
        		gm.LineTo(new Point2D(b.src.pos.x + 40, b.src.pos.y));
        		gm.LineTo(new Point2D(b.src.pos.x + 40, b.src.pos.y - 40));
        		gm.LineTo(new Point2D(b.src.pos.x, b.src.pos.y - 40));
        		gm.LineTo(b.dest.pos);
    		}else{
        		gm.moveTo(b.src.pos);
        		gm.LineTo(b.dest.pos);
    		}
    		gm.stroke();
    		gm.closePath();
		}
    }

}
