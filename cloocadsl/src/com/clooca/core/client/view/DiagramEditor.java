package com.clooca.core.client.view;

import java.util.List;

import com.clooca.core.client.model.gopr.element.Diagram;
import com.clooca.core.client.model.gopr.element.NodeObject;
import com.clooca.core.client.model.gopr.element.Property;
import com.clooca.core.client.model.gopr.element.Relationship;
import com.clooca.core.client.model.gopr.metaelement.GraphicInfo;
import com.clooca.core.client.model.gopr.metaelement.MetaObject;
import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
import com.clooca.core.client.model.gopr.metaelement.MetaRelation;
import com.clooca.core.client.presenter.DiagramController;
import com.clooca.core.client.util.ArrowHead;
import com.clooca.core.client.util.GraphicManager;
import com.clooca.core.client.util.Line2D;
import com.clooca.core.client.util.Point2D;
import com.clooca.core.client.util.Rectangle2D;
import com.google.gwt.canvas.client.Canvas;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.DoubleClickEvent;
import com.google.gwt.event.dom.client.DoubleClickHandler;
import com.google.gwt.event.dom.client.MouseDownEvent;
import com.google.gwt.event.dom.client.MouseDownHandler;
import com.google.gwt.event.dom.client.MouseMoveEvent;
import com.google.gwt.event.dom.client.MouseMoveHandler;
import com.google.gwt.event.dom.client.MouseOutEvent;
import com.google.gwt.event.dom.client.MouseOutHandler;
import com.google.gwt.event.dom.client.MouseOverEvent;
import com.google.gwt.event.dom.client.MouseOverHandler;
import com.google.gwt.event.dom.client.MouseUpEvent;
import com.google.gwt.event.dom.client.MouseUpHandler;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.user.client.ui.Label;
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
public class DiagramEditor extends AbstractEditor implements MouseDownHandler,MouseUpHandler,MouseMoveHandler,ClickHandler, DoubleClickHandler {
	Diagram diagram;
	private DiagramController mDiagramController;
//	private ModelController mModelController;
	
	private Canvas canvas;
	
	private FlowPanel toolpanel = new FlowPanel();
	
    private ToggleButton[] buttons;
    private Tool[] tools;
    Tool selected_tool = null;
	
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
    public DiagramEditor(DiagramController c) {
    	super();
    	this.mDiagramController = c;
    	this.diagram = c.getDiagram();
    	/*
    	this.metamodeltables = c.getMetaModelTables();
    	this.modeltables = c.getModelTables();
    	*/
    	initEditor(init(), "diagram", "diageam"+this.diagram.id);
		draw();
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
		setSelectedButton(this.buttons[0]);
		return hpanel;
	}
	
	private Tool[] getTools(Diagram g) {
    	List<MetaObject> nodes = g.meta.meta_objects;
    	List<MetaRelation> edges = g.meta.meta_relations;
    	int length = nodes.size() + edges.size() + 1;
		Tool[] tools = new Tool[length];
		tools[0] = new Tool("select");
    	for(int i = 0;i < nodes.size();i++) {
       		tools[i+1] = new Tool(nodes.get(i), nodes.get(i).name, "class");
    	}
    	for(int i = 0;i < edges.size();i++) {
       		tools[i+nodes.size()+1] = new Tool(edges.get(i), edges.get(i).name, "association1");
    	}
    	return tools;
	}

	private void createButton() {
		tools = getTools(this.diagram);
		buttons = new ToggleButton[tools.length];
    	for(int i = 0;i < tools.length;i++) {
    		String label = tools[i].getLabel();
    		final String tool_name = tools[i].getName();
            final ToggleButton button = new ToggleButton(new Image("/static/images/"+label+".png"));
            button.addClickHandler(new ClickHandler() {
            	
    			@Override
    			public void onClick(ClickEvent event) {
    				setSelectedButton(button);
//    				selected_tool = nodes.get(i);
    			}
            });
			final ToolPopup toolPopup = new ToolPopup(tool_name);
            button.addMouseOverHandler(new MouseOverHandler(){

				@Override
				public void onMouseOver(MouseOverEvent event) {
					toolPopup.setPopupPosition(button.getAbsoluteLeft()+button.getOffsetWidth(), button.getAbsoluteTop());
					toolPopup.show();
				}});
            button.addMouseOutHandler(new MouseOutHandler(){

				@Override
				public void onMouseOut(MouseOutEvent event) {
					toolPopup.hide();
				}});
            buttons[i] = button;
            toolpanel.add(button);
    	}
	}
	
	private void setSelectedButton(ToggleButton button) {
    	for(int i = 0;i < buttons.length;i++) {
			if(buttons[i].equals(button)) {
				buttons[i].setDown(true);
				selected_tool = tools[i];
			}else{
				buttons[i].setDown(false);
			}
		}
	}
	
	private class ToolPopup extends PopupPanel {
		public ToolPopup(String text){
			super(true, false); 
			setWidget(new Label(text));
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
		if(mDiagramController.moveAction(mouse.x, mouse.y)) draw();
	}

	@Override
	public void onMouseUp(MouseUpEvent event) {
		mouse.x = event.getX();
		mouse.y = event.getY();
		this.mDiagramController.upAction(mouse.x, mouse.y, selected_tool);
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
		this.mDiagramController.downAction(mouse.x, mouse.y, selected_tool);
		draw();
	}
	
    Command com_close = new Command() {
    	  public void execute() {
    	    popupPanel.hide();
    	    
    	  }
    	};

        Command com_delete = new Command() {
      	  public void execute() {
      		  popupPanel.hide();
      		  mDiagramController.deleteElement();
      		  draw();
      	  }
      	};

        Command com_deletepoint = new Command() {
        	  public void execute() {
        		  popupPanel.hide();
        		  mDiagramController.deletePoint();
        		  draw();
        	  }
        	};

    private void createPopupMenu() {
    	popupPanel.clear();
    	MenuBar popupMenuBar = new MenuBar(true);
    	MenuItem closeItem = new MenuItem("閉じる", true, com_close);
    	MenuItem deleteItem = new MenuItem("削除", true, com_delete);
    	MenuItem deletePointItem = new MenuItem("ポイントを削除", true, com_deletepoint);
  	    
    	popupPanel.setStyleName("contextmenu");
    	closeItem.addStyleName("contextmenu_item");
    	deleteItem.addStyleName("contextmenu_item");
    	deletePointItem.addStyleName("contextmenu_item");
    	popupMenuBar.addItem(closeItem);
    	popupMenuBar.addItem(deleteItem);
    	popupMenuBar.addItem(deletePointItem);
    	
    	popupMenuBar.setVisible(true);
    	popupPanel.add(popupMenuBar);
    }
    
    public void draw() {
    	GraphicManager gm = new GraphicManager(canvas.getContext2d());
    	gm.clearRect(new Rectangle2D(0,0,CANVAS_WIDTH,CANVAS_HEIGHT));
    	for(NodeObject obj : this.diagram.nodes) {
    		draw(gm, obj);
    	}
    	for(Relationship rel : this.diagram.relationships) {
    		draw(gm, rel);
    	}
    	mDiagramController.draw(gm);
    }
    
    public void draw(GraphicManager gm, NodeObject obj) {
		gm.beginPath();
		gm.setColor("WHITE");
		gm.setFillStyle("WHITE");
		if(this.mDiagramController.getSelected() != null && this.mDiagramController.getSelected().equals(obj)) gm.setColor("BLUE");
		obj.bound.width = 60;
		obj.bound.height = obj.properties.size() * 20;
		if(obj.properties.size() == 0) obj.bound.height = 20;
		int h = 01;
		for(Property prop : obj.properties) {
			MetaProperty metaprop = prop.meta;
			if(metaprop == null) continue;
			if(metaprop.data_type.matches(MetaProperty.STRING)) {
//				obj.properties.
				gm.DrawText(prop.content, (int)obj.pos.x + 4, (int)obj.pos.y+20*h - 4, 100);
				if(obj.bound.width < prop.content.length() * 8) obj.bound.width = prop.content.length() * 8;
			}else if(metaprop.data_type.matches(MetaProperty.NUMBER)) {
				gm.DrawText(prop.content, (int)obj.pos.x + 4, (int)obj.pos.y+20*h - 4, 100);
				if(obj.bound.width < prop.content.length() * 8) obj.bound.width = prop.content.length() * 8;
			}else if(metaprop.data_type.matches(MetaProperty.COLLECTION)) {
//				obj.properties.
			}
			h++;
		}
		Rectangle2D bound = new Rectangle2D(obj.pos.x, obj.pos.y, obj.bound.width, obj.bound.height);
		if(obj.meta.graphic.shape.matches(GraphicInfo.RECT)) {
			gm.StrokeRect(bound);
		}else if(obj.meta.graphic.shape.matches(GraphicInfo.ROUNDED)) {
			gm.StrokeRoundRect(bound, 6);
		}else if(obj.meta.graphic.shape.matches(GraphicInfo.CIRCLE)) {
	    	Point2D s = new Point2D((bound.x + bound.width / 2), (bound.y + bound.height / 2));
			gm.StrokeCircle(s, 16);
		}else{
			gm.beginPath();
//			gm.moveTo(p);
//			gm.LineTo(p);
			gm.closePath();
		}
		gm.stroke();
		gm.closePath();
    }
    
    public void draw(GraphicManager gm, Relationship rel) {
    	Point2D s = new Point2D((rel.src.pos.x + rel.src.bound.width / 2), (rel.src.pos.y + rel.src.bound.height / 2));
    	Point2D e = new Point2D((rel.dest.pos.x + rel.dest.bound.width / 2), (rel.dest.pos.y + rel.dest.bound.height / 2));
		gm.beginPath();
		gm.setColor("WHITE");
		gm.setFillStyle("WHITE");
		if(this.mDiagramController.getSelected() != null && this.mDiagramController.getSelected().equals(rel)) gm.setColor("BLUE");
		Point2D start = getConnectionPoint(new Line2D(s, e), rel.src.bound);
		Point2D end = getConnectionPoint(new Line2D(e, s), rel.dest.bound);
		gm.moveTo(start);
		for(Point2D p : rel.points) {
			gm.LineTo(p);
		}
		gm.LineTo(end);
		if(this.mDiagramController.getSelected() != null && this.mDiagramController.getSelected().equals(rel)) {
			for(Point2D p : rel.points) {
				gm.StrokeRect(new Rectangle2D(p.x - 5, p.y - 5, 10, 10));
			}
		}
		gm.stroke();
		gm.closePath();
		ArrowHead ah = null;
		if(rel.meta.arrow_type.matches(ArrowHead.NONE)) {
			ah = new ArrowHead(ArrowHead.ArrowType.NONE);
		}else if(rel.meta.arrow_type.matches(ArrowHead.V)) {
			ah = new ArrowHead(ArrowHead.ArrowType.V);
		}else if(rel.meta.arrow_type.matches(ArrowHead.TRIANGLE)) {
			ah = new ArrowHead(ArrowHead.ArrowType.TRIANGLE);
		}
		if(ah != null) ah.draw(gm, start, end);
		
		/*
		 * propertyを表示
		 */
		Point2D prop_pos = new Point2D((start.x+end.x) / 2, (start.y + end.y) / 2);
		if(rel.points.size() > 0) {
			prop_pos.x = (rel.points.get(0).x + prop_pos.x) / 2;
			prop_pos.y = (rel.points.get(0).y + prop_pos.y) / 2;
		}
		for(Property prop : rel.properties) {
			MetaProperty metaprop = prop.meta;
			if(metaprop == null) continue;
			if(metaprop.data_type.matches(MetaProperty.STRING)) {
				gm.DrawText(prop.content, (int)prop_pos.getX(), (int)prop_pos.getY(), 100);
			}else if(metaprop.data_type.matches(MetaProperty.NUMBER)) {
				gm.DrawText(prop.content, (int)prop_pos.getX(), (int)prop_pos.getY(), 100);
			}else if(metaprop.data_type.matches(MetaProperty.COLLECTION)) {
//				obj.properties.
			}
		}

    }
    
	public Point2D getConnectionPoint(Line2D d, Rectangle2D bound) {
		if(d.intersectsLine(bound.x, bound.y, bound.x+bound.width, bound.y)) {
			return d.getConnect(new Line2D(bound.x, bound.y, bound.x+bound.width, bound.y));
		}
		if(d.intersectsLine(bound.x+bound.width, bound.y, bound.x+bound.width, bound.y+bound.height)) {
			return d.getConnect(new Line2D(bound.x+bound.width, bound.y, bound.x+bound.width, bound.y+bound.height));
		}
		if(d.intersectsLine(bound.x+bound.width, bound.y+bound.height, bound.x, bound.y+bound.height)) {
			return d.getConnect(new Line2D(bound.x+bound.width, bound.y+bound.height, bound.x, bound.y+bound.height));
		}
		if(d.intersectsLine(bound.x, bound.y+bound.height, bound.x, bound.y)) {
			return d.getConnect(new Line2D(bound.x, bound.y+bound.height, bound.x, bound.y));
		}
		return new Point2D(bound.getX(), bound.getY());
	}
	
	public class Tool {		
		String label;
		String name;
		Object ToolKind;

		public Tool(String l) {
			label = l;
			this.name = l;
			ToolKind = null;
		}

		public Tool(MetaObject n, String name, String l) {
			label = l;
			this.name = name;
			ToolKind = n;
		}
		
		public Tool(MetaRelation e, String name, String l) {
			label = l;
			this.name = name;
			ToolKind = e;
		}
		
		public String getLabel() {
			return label;
		}
		
		public String getName() {
			return name;
		}
		
		public Object getToolKind() {
			return ToolKind;
		}
	}
	
}
