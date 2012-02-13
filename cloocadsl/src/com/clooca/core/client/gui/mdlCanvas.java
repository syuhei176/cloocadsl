package com.clooca.core.client.gui;

import java.util.ArrayList;

import com.google.gwt.canvas.client.Canvas;
import com.google.gwt.canvas.dom.client.ImageData;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.DoubleClickEvent;
import com.google.gwt.event.dom.client.DoubleClickHandler;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.dom.client.KeyPressEvent;
import com.google.gwt.event.dom.client.KeyPressHandler;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.event.dom.client.MouseDownEvent;
import com.google.gwt.event.dom.client.MouseDownHandler;
import com.google.gwt.event.dom.client.MouseMoveEvent;
import com.google.gwt.event.dom.client.MouseMoveHandler;
import com.google.gwt.event.dom.client.MouseUpEvent;
import com.google.gwt.event.dom.client.MouseUpHandler;
import com.google.gwt.event.dom.client.TouchCancelEvent;
import com.google.gwt.event.dom.client.TouchEndEvent;
import com.google.gwt.event.dom.client.TouchMoveEvent;
import com.google.gwt.event.dom.client.TouchStartEvent;
import com.google.gwt.event.dom.client.TouchStartHandler;
import com.google.gwt.event.dom.client.TouchMoveHandler;
import com.google.gwt.event.dom.client.TouchEndHandler;
import com.google.gwt.event.dom.client.TouchCancelHandler;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.Cookies;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.MenuBar;
import com.google.gwt.user.client.ui.MenuItem;
import com.google.gwt.user.client.ui.PopupPanel;
import com.google.gwt.user.client.ui.ScrollPanel;
import com.clooca.core.client.diagram.*;
import com.clooca.core.client.gopr.element.*;
import com.clooca.core.client.gopr.metamodel.*;
import com.clooca.core.client.gui.ToolPanel.Tool;
import com.clooca.core.client.gui.ToolPanel.ToolSelectionListener;
import com.clooca.core.client.util.*;

/**
 * 
 * @author Syuhei Hiya
 * @version 1
 *
 */
public class mdlCanvas implements mdlAbstractEditor,MouseDownHandler,MouseUpHandler,MouseMoveHandler,ClickHandler, DoubleClickHandler, ToolSelectionListener {
 
	private ArrayList<ElementSelectionListener> listeners;
	 
	private Diagram diagram;
	 
	private Canvas canvas;
	
	private ScrollPanel mainpanel;
	
	private String name;
	
	private String key;
	
	/*
	 * 選択中のツール
	 */
	private MetaElement selectedTool;
	
	/*
	 * 選択中の要素
	 */
	private Object selectedElement;

	private ArrayList<Object> selectedElements = new ArrayList<Object>();
	
	private ArrayList<Object> copiedElements = new ArrayList<Object>();	

	private Point2D mouse = new Point2D(0, 0);
	
	private Point2D lastMousePoint = new Point2D(0, 0);
	
	private Point2D mouseDownPoint = new Point2D(0, 0);
	
	private enum DragMode {DRAG_RUBBERBAND, DRAG_MOVE, DRAG_NONE, DRAG_POINT, DRAG_RANGE};
	
	private DragMode dragMode = DragMode.DRAG_NONE;

	final static int CANVAS_WIDTH = 1000;
	
	final static int CANVAS_HEIGHT = 800;

	final static int PANEL_WIDTH = 740;
	
	final static int PANEL_HEIGHT = 500;

	final Rectangle2D bound = new Rectangle2D(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	final Rectangle2D panel_bound = new Rectangle2D(0, 0, PANEL_WIDTH, PANEL_HEIGHT);

	private CanvasHistoryManager historyManager;
	
//	private PropertyPanel mPropertyPanel;
	
	private ToolPanel mToolPanel;
	
	public mdlCanvas(String name, String key, ToolPanel mToolPanel, Diagram g) {
		this.key = key;
		this.setName(name);
//		this.modeleditor = meditor;
		this.diagram = g;
		this.mToolPanel = mToolPanel;
//		this.mDiagramExplorer = mDiagramExplorer;
		canvas = makeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
		mainpanel = makePanel(canvas);
		listeners = new ArrayList<ElementSelectionListener>();
//		mPropertyPanel = new PropertyPanel();
		this.addElementSelectionListener(PropertyPanel.GetElementSelectionListener());
//		this.canvasTabPanel.addListener(PropertyPanel);
		if(mToolPanel != null) mToolPanel.addListener(this);
		
		/*
		historyManager = new CanvasHistoryManager(diagram);
		this.diagram.addGraphModificationListener(historyManager.getListener());
		*/
	    
		String canvas_size = Cookies.getCookie("canvas_size");
	      
	    if(canvas_size != null) {
	    	if(canvas_size.matches("C8")) {
	    		this.setCanvasSize(1000, 800);
		    }else if(canvas_size.matches("C12")) {
	    		this.setCanvasSize(1400, 1200);
		    }
	    }
	    
	    setPanelSize(Window.getClientWidth() - 72 - 240 - 32, Window.getClientHeight() - 220);
	    // リサイズイベント
	    Window.addResizeHandler(new ResizeHandler() {
	        public void onResize(ResizeEvent ev) {
	            setPanelSize(ev.getWidth() - 72 - 240 - 32, ev.getHeight() - 220);
	        }
	    });
	    
	    canvas.addKeyDownHandler(new KeyDownHandler(){

			@Override
			public void onKeyDown(KeyDownEvent event) {
				if(event.isControlKeyDown()) {
					if(event.getNativeKeyCode() == 'C') {
						doActionCopy();
					}
					if(event.getNativeKeyCode() == 'V') {
						doActionPaste();
					}
					if(event.getNativeKeyCode() == 'X') {
						doActionPaste();
						doActionDelete();
					}
					if(event.getNativeKeyCode() == 'Z') {
						doActionUndo();
					}
				}else if(event.isShiftKeyDown()){
					if(event.getNativeKeyCode() == 'D') {
						doActionDelete();
					}else if(event.getNativeKeyCode() == 'L') {
						
					}else if(event.getNativeKeyCode() == 'N') {
						
					}
				}
			}});
	    canvas.addKeyPressHandler(new KeyPressHandler(){

			@Override
			public void onKeyPress(KeyPressEvent event) {
				
			}});
	    canvas.addKeyUpHandler(new KeyUpHandler(){

			@Override
			public void onKeyUp(KeyUpEvent event) {
				
			}});
	    this.draw(0);
	}
	
	public mdlCanvas(String name, Graph g, int w, int h) {
		this.setName(name);
		/*
		this.diagram = g;
		canvas = makeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
		mainpanel = makePanel(canvas);
		listeners = new ArrayList<ElementSelectionListener>();
		this.addElementSelectionListener(PropertyPanel.GetElementSelectionListener());
		if(mToolPanel != null) mToolPanel.addListener(this);
		historyManager = new CanvasHistoryManager(diagram);
		this.diagram.addGraphModificationListener(historyManager.getListener());
		*/
		this.setCanvasSize(1400, 1200);
	    setPanelSize(w, h);
	    this.draw(0);
	}

	
	public ScrollPanel getPanel() {
		return mainpanel;
	}
	
	public void addElementSelectionListener(ElementSelectionListener l) {
		listeners.add(l);
	}
	
	public void doActionUndo() {
		historyManager.undo();
		draw(0);
	}
	
	public void doActionRedo() {
		historyManager.redo();
		draw(0);
	}

	public void doActionDelete() {
		if(selectedElement != null) {
			if(selectedElement instanceof NodeObject) {
				diagram.removeNode((NodeObject)selectedElement);
			}
			if(selectedElement instanceof Relationship) {
				diagram.removeRelationship((Relationship)selectedElement);
			}
			selectedElement = null;
			draw(0);
		}
	}

	public void doActionCopy() {
		copiedElements.clear();
		if(selectedElement != null) {
			if(selectedElement instanceof Node) {
				copiedElements.add(selectedElement);
			}
		}		
//		this.selectedElements
	}
	
	public void doActionPaste() {
		for(Object o : copiedElements) {
			if(o instanceof NodeObject) {
				NodeObject node = (NodeObject)o;
				diagram.addNodeAtPoint((NodeObject)node.clone(), (Point2D)mouse.clone());
			}
		}
		draw(0);
	}


    final private PopupPanel popupPanel = new PopupPanel(true);
    
        Command com_create_diagram = new Command() {
      	  public void execute() {
      	    popupPanel.hide();
        	CreateRelatedDiagram();
      	  }
      	};
    
        Command com_property = new Command() {
        	  public void execute() {
        	    popupPanel.hide();
        	    /*
      		PropertyDialog propertyDialog = new PropertyDialog(PropertyPanel.getpanel(), mdlCanvas.this);
      		propertyDialog.show();
      		propertyDialog.center();
      		*/
        	  }
        	};

        Command com_close = new Command() {
      	  public void execute() {
      	    popupPanel.hide();
      	  EditorTabPanel.CloseSelectedTab();
      	  }
      	};

        Command com_hide_details = new Command() {
        	  public void execute() {
        	    popupPanel.hide();
        	    if(selectedElement instanceof RectangleNode) {
        	    	((RectangleNode)selectedElement).hide_detail();
        	    }
        	  }
        	};

            Command com_show_details = new Command() {
          	  public void execute() {
          	    popupPanel.hide();
          	    if(selectedElement instanceof RectangleNode) {
          	    	((RectangleNode)selectedElement).show_detail();
          	    }
          	  }
          	};

            Command com_delete = new Command() {
          	  public void execute() {
          	    popupPanel.hide();
          	    doActionDelete();
          	  }
          	};

            Command com_copy = new Command() {
          	  public void execute() {
          	    popupPanel.hide();
          	    doActionCopy();
          	  }
          	};

            Command com_paste = new Command() {
          	  public void execute() {
          	    popupPanel.hide();
          	    doActionPaste();
          	  }
          	};
          	
          	
    private void createPopupMenu() {
    	popupPanel.clear();
    	MenuBar popupMenuBar = new MenuBar(true);
    	MenuItem propItem = new MenuItem("プロパティ", true, com_property);
    	MenuItem closeItem = new MenuItem("閉じる", true, com_close);
    	MenuItem hidedetailsItem = null;
  	    if(selectedElement instanceof RectangleNode) {
  	    	if(((RectangleNode)selectedElement)._is_show_detail()) {
  	        	hidedetailsItem = new MenuItem("詳細を隠す", true, com_hide_details);
  	    	}else{
  	        	hidedetailsItem = new MenuItem("詳細を表示する", true, com_show_details);
  	    	}
  	    	hidedetailsItem.addStyleName("contextmenu_item");
  	    }
    	MenuItem cItem = new MenuItem("コピー", true, com_copy);
    	MenuItem pItem = new MenuItem("貼り付け", true, com_paste);
    	MenuItem dItem = new MenuItem("削除", true, com_delete);
  	    
    	popupPanel.setStyleName("contextmenu");
    	cItem.addStyleName("contextmenu_item");
    	pItem.addStyleName("contextmenu_item");
    	dItem.addStyleName("contextmenu_item");
    	propItem.addStyleName("contextmenu_item");
    	closeItem.addStyleName("contextmenu_item");
    	
    	popupMenuBar.addItem(cItem);
    	popupMenuBar.addItem(pItem);
    	popupMenuBar.addItem(dItem);
    	popupMenuBar.addItem(propItem);
    	popupMenuBar.addItem(closeItem);
    	if(hidedetailsItem != null) popupMenuBar.addItem(hidedetailsItem);
    	
       	MenuItem imageItem = new MenuItem("関連する図の作成", true, com_create_diagram);
       	imageItem.addStyleName("contextmenu_item");
       	popupMenuBar.addItem(imageItem);

    	popupMenuBar.setVisible(true);
    	popupPanel.add(popupMenuBar);
    }
    
	@Override
	public void onMouseDown(MouseDownEvent event) {
		GWT.log("diagram " + diagram.getNodeObjects().size());
		mouse.x = event.getX();
		mouse.y = event.getY();
		if(DOM.eventGetButton(DOM.eventGetCurrentEvent())==Event.BUTTON_RIGHT){
			  int x = DOM.eventGetClientX(DOM.eventGetCurrentEvent());
			  int y = DOM.eventGetClientY(DOM.eventGetCurrentEvent());
//			  popupPanel.setPopupPosition((int)mouse.x, (int)mouse.y);
			  createPopupMenu();
			  popupPanel.setPopupPosition(x, y);
			  popupPanel.show();
			  return;
		}
		if(selectedTool == null) {
			/*
			 * Select
			 */
			Relationship e = diagram.findRelationship(mouse);
			NodeObject n = diagram.findNode(mouse);
			if(n != null) {	//node
				dragMode = DragMode.DRAG_MOVE;
				if(selectedElements.isEmpty()) {
					SelectElement(n);
					fireSelectionElement();
				}else{
					
				}
			}else if(e != null) {
				if(selectedElement != null && selectedElement.equals(e)) {
					/*
					 * 同じも�?を�?ウス�?��ンすると選択中モードにな�?
					 */
					dragMode = DragMode.DRAG_POINT;
				}else{
					/*
					 * �?��マウス�?��ンすると選択中モードにな�?
					 */
					SelectElement(e);
					fireSelectionElement();
				}
			}else{
				SelectElement(null);
				this.selectedElements.clear();
				dragMode = DragMode.DRAG_RANGE;
			}
		}else if(selectedTool instanceof MetaObject) {
			NodeObject new_node = (NodeObject)selectedTool.getInstance();
			diagram.addNodeAtPoint(new_node, mouse);
			draw(0);
			mToolPanel.SelectTool(0);
		}else if(selectedTool instanceof MetaRelation) {
			dragMode = DragMode.DRAG_RUBBERBAND;
			lastMousePoint = (Point2D) mouse.clone();
//			mouseDownPoint = (Point2D) mouse.clone();
		}
		mouseDownPoint = (Point2D) mouse.clone();
		lastMousePoint = (Point2D) mouse.clone();
		
	}
	
	@Override
	public void onMouseUp(MouseUpEvent event) {
		mouse.x = event.getX();
		mouse.y = event.getY();
		if(dragMode == DragMode.DRAG_RUBBERBAND) {
			if(selectedTool instanceof MetaRelation) {
				Relationship new_binding = (Relationship)selectedTool.getInstance();
				
				diagram.addEdgeAtPoints(new_binding, mouseDownPoint, mouse);
				draw(0);
				mToolPanel.SelectTool(0);
			}
		}
		if(dragMode == DragMode.DRAG_POINT && selectedElement instanceof Edge) {
			if(lastMousePoint.distanceSq(mouse) > 49) {
				((ShapeEdge)selectedElement).movepoint((Point2D)lastMousePoint.clone(), (Point2D)mouse.clone());
			}
			draw(0);
		}
		if(dragMode == DragMode.DRAG_RANGE) {
			ArrayList<Object> tmps = new ArrayList<Object>();
			Rectangle2D rect = new Rectangle2D(lastMousePoint.x, lastMousePoint.y, mouse.x - lastMousePoint.x, mouse.y - lastMousePoint.y);
			for(NodeObject node : this.diagram.getNodeObjects()) {
				if(rect.contains(node.getBounds().x, node.getBounds().y, node.getBounds().width, node.getBounds().height)) {
					tmps.add(node);
				}
			}
			/*
			for(Binding binding: this.diagram.getBindings()) {
				if(rect.contains(binding.getBounds().x, binding.getBounds().y, binding.getBounds().width, binding.getBounds().height)) {
					tmps.add(binding);
				}
			}
			*/
			this.SelectElements(tmps);
//			this.diagram.getEdges()
		}
		if(dragMode == DragMode.DRAG_MOVE) {
			double dx = mouse.getX() - mouseDownPoint.getX();
			double dy = mouse.getY() - mouseDownPoint.getY();
			if(selectedElement != null && selectedElement instanceof Node) {
				this.diagram.fireNodeMoved((NodeObject)selectedElement, dx, dy);
			}
			for(Object o : selectedElements) {
				if(o instanceof NodeObject) this.diagram.fireNodeMoved((NodeObject)o, dx, dy);
			}
		}
		dragMode = DragMode.DRAG_NONE;
	}

	@Override
	public void onMouseMove(MouseMoveEvent event) {
		mouse.x = event.getX();
		mouse.y = event.getY();
		if(dragMode == DragMode.DRAG_MOVE) {
			double dx = mouse.getX() - lastMousePoint.getX();
			double dy = mouse.getY() - lastMousePoint.getY();
			if(selectedElement != null && selectedElement instanceof NodeObject) {
				diagram.trasitionNode(dx, dy, (NodeObject)selectedElement);
			}
			for(Object o : selectedElements) {
				if(o instanceof NodeObject) {
					diagram.trasitionNode(dx, dy, (NodeObject)o);
				}
			}
			lastMousePoint = (Point2D) mouse.clone();
			draw(0);
		}else if(dragMode == DragMode.DRAG_RUBBERBAND) {
			draw(0);
		}else if(dragMode == DragMode.DRAG_RANGE) {
			draw(0);
		}else{
			
		}
	}

	@Override
	public void onClick(ClickEvent event) {
//		propertyDialog.hide();
		draw(0);		
	}
	
	@Override
	public void onDoubleClick(DoubleClickEvent event)
	{
		Relationship e = diagram.findRelationship(mouse);
		NodeObject n = diagram.findNode(mouse);
		if(n != null) {
//			selectedElement = n;
			SelectElement(n);
			fireSelectionElement();
			/*
      		PropertyDialog propertyDialog = new PropertyDialog(PropertyPanel.getpanel(), this);
      		propertyDialog.show();
      		propertyDialog.center();
      		*/
		}else if(e != null) {
//			selectedElement = e;
			SelectElement(e);
			fireSelectionElement();
			/*
      		PropertyDialog propertyDialog = new PropertyDialog(PropertyPanel.getpanel(), this);
      		propertyDialog.show();
      		propertyDialog.center();
      		*/
		}else{
//			selectedElement = null;
			SelectElement(null);
		}

		
	}

	@Override
	public void toolSelectionChanged(Tool selectedTool) {
		this.selectedTool = selectedTool.getToolKind();
	}

    public void draw(int option){
    	this.draw(option, 100);
    }

    public void draw(int option, int z){
    	GraphicManager gm = new GraphicManager(canvas.getContext2d());
    	gm.beginPath();
    	gm.clearRect(bound);
    	gm.setColor("BLACK");
    	diagram.draw(gm);
		GWT.log("diagram " + diagram.getNodeObjects().size());
    	
		if(dragMode == DragMode.DRAG_RUBBERBAND) {
			gm.beginPath();
			gm.moveTo(mouseDownPoint);
			gm.LineTo(mouse);
			gm.stroke();
			gm.closePath();
		}
		if(dragMode == DragMode.DRAG_RANGE) {
			gm.beginPath();
			gm.StrokeRect(new Rectangle2D(lastMousePoint.x, lastMousePoint.y, mouse.x - lastMousePoint.x, mouse.y - lastMousePoint.y));
			gm.stroke();
			gm.closePath();
		}
    	gm.closePath();
    }
    
	private Canvas makeCanvas(int w, int h)
	{
		Canvas c;
		c = Canvas.createIfSupported();
		c.setCoordinateSpaceWidth(w);
		c.setCoordinateSpaceHeight(h);
		c.addClickHandler(this);
		c.addDoubleClickHandler(this);
/*
 * タブレットへの対応
 */
//		if(PlatformDetecter.getOs().matches("Win32")) {
			c.addMouseDownHandler(this);
			c.addMouseUpHandler(this);
			c.addMouseMoveHandler(this);
//		}else{
			/*
		    c.addTouchStartHandler(touchStartHandler);
		    c.addTouchMoveHandler(touchMoveHandler);
		    c.addTouchEndHandler(touchEndHandler);
		    c.addTouchCancelHandler(touchCancelHandler);
		    */
//		}

		return c;
	}
	
	private ScrollPanel makePanel(Canvas canvas)
	{
		ScrollPanel panel = new ScrollPanel();
		panel.add(canvas);
//		AbsolutePanel panel = new AbsolutePanel();
		panel.setPixelSize(PANEL_WIDTH, PANEL_HEIGHT);
//		panel.setStyleName("mycanvas");
//		panel.add(canvas);
		return panel;
	}

	public Diagram getDiagram() {
		return diagram;
	}
	
	public void fireSelectionElement() {
		for(ElementSelectionListener l : listeners) {
			l.OnSelectElement(selectedElement);
		}
	}
	
	public void CreateRelatedDiagram() {
		if(!(selectedElement instanceof Node)) return;
		Node klass = ((Node)selectedElement);
		String property_name = klass.getName();
		if(klass.getPrototype() == null) return;
		if(klass.GetLinkedGraph() != null) return;
		Graph new_diagram = klass.getPrototype().clone();
		new_diagram.setName(property_name);
//		EditorTabPanel.CreateNewTab(property_name, new mdlCanvas(property_name, getKey()+property_name, mToolPanel, new_diagram));
//		mDiagramExplorer.addDiagram(property_name, new_diagram);
		klass.LinkToGraph(new_diagram);
//		mDiagramExplorer.refresh();
		CommonController.GetModelExplorer().refresh();
	}
	
	public int getCanvasWidth()
	{
		return this.canvas.getCoordinateSpaceWidth();
	}
	public int getCanvasHeight()
	{
		return this.canvas.getCoordinateSpaceHeight();
	}
	
	public void setCanvasWidth(int w)
	{
		canvas.setCoordinateSpaceWidth(w);
		bound.width = w;
	}
	
	public void setCanvasHeight(int h)
	{
		canvas.setCoordinateSpaceHeight(h);
		bound.height = h;
	}
	
	public void setCanvasSize(int w, int h)
	{
		setCanvasWidth(w);
		setCanvasHeight(h);
	}
	
	public void setPanelSize(int w, int h)
	{
	    panel_bound.width = w;
	    panel_bound.height = h;
		mainpanel.setPixelSize(w, h);
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}
	
	public ImageData getImageData() {
		return canvas.getContext2d().getImageData(0, 0, canvas.getCoordinateSpaceWidth(), canvas.getCoordinateSpaceHeight());
	}
	
	private int zoom = 100;
	
	public void SetZoom(int zoom) {
		if(zoom >= 50 && zoom <= 200) {
			this.zoom = zoom;
		}
	}
	
	private void SelectElement(Object sel_elem) {
		if(selectedElement != null) {
			if(selectedElement instanceof NodeObject) {
				((NodeObject)selectedElement).setColor("BLACK");
			}
			if(selectedElement instanceof Edge) {
				((Edge)selectedElement).setColor("BLACK");
			}

		}
		for(Object o: selectedElements) {
			if(o instanceof NodeObject) {
				((NodeObject)o).setColor("BLACK");
			}
			if(o instanceof Edge) {
				((Edge)o).setColor("BLACK");
			}
		}
		
		selectedElements.clear();
		selectedElement = sel_elem;
		
		if(selectedElement != null) {
			if(selectedElement instanceof NodeObject) {
				((NodeObject)selectedElement).setColor("BLUE");
			}
			if(selectedElement instanceof Edge) {
				((Edge)selectedElement).setColor("BLUE");
			}
		}
	}

	private void SelectElements(ArrayList<Object> sel_elems) {
		if(selectedElement != null) {
			if(selectedElement instanceof NodeObject) {
				((NodeObject)selectedElement).setColor("BLACK");
			}
			if(selectedElement instanceof Edge) {
				((Edge)selectedElement).setColor("BLACK");
			}

		}
		for(Object o: selectedElements) {
			if(o instanceof NodeObject) {
				((NodeObject)o).setColor("BLACK");
			}
			if(o instanceof Edge) {
				((Edge)o).setColor("BLACK");
			}
		}
		
		selectedElement = null;
		selectedElements = (ArrayList<Object>)sel_elems.clone();
		
		for(Object o: selectedElements) {
			if(o instanceof NodeObject) {
				((NodeObject)o).setColor("BLUE");
			}
			if(o instanceof Edge) {
				((Edge)o).setColor("BLUE");
			}
		}
	}
	
	/*
	TouchStartHandler touchStartHandler = new TouchStartHandler(){

		@Override
		public void onTouchStart(TouchStartEvent event) {
			mouse.x = event.getNativeEvent().getClientX();
			mouse.y = event.getNativeEvent().getClientY();
			if(DOM.eventGetButton(DOM.eventGetCurrentEvent())==Event.BUTTON_RIGHT){
				  int x = DOM.eventGetClientX(DOM.eventGetCurrentEvent());
				  int y = DOM.eventGetClientY(DOM.eventGetCurrentEvent());
//				  popupPanel.setPopupPosition((int)mouse.x, (int)mouse.y);
				  createPopupMenu();
				  popupPanel.setPopupPosition(x, y);
				  popupPanel.show();
				  return;
			}
			if(selectedTool == null) {
				//Select
				Edge e = diagram.findEdge(mouse);
				Node n = diagram.findNode(mouse);
				if(n != null) {
					dragMode = DragMode.DRAG_MOVE;
					SelectElement(n);
					fireSelectionElement();
				}else if(e != null) {
					if(selectedElement != null && selectedElement.equals(e)) {
						dragMode = DragMode.DRAG_POINT;
					}else{
						SelectElement(e);
						fireSelectionElement();
					}
				}else{
					SelectElement(null);
					selectedElements.clear();
					dragMode = DragMode.DRAG_RANGE;
				}
			}else if(selectedTool instanceof Node) {
				Node proto_node = (Node)selectedTool;
				Node new_node = (Node)proto_node.clone();
				diagram.addNodeAtPoint(new_node, mouse);
				draw(0);
				mToolPanel.SelectTool(0);
			}else if(selectedTool instanceof Edge) {
				dragMode = DragMode.DRAG_RUBBERBAND;
				lastMousePoint = (Point2D) mouse.clone();
//				mouseDownPoint = (Point2D) mouse.clone();
			}else if(selectedTool instanceof Graph) {
//				Graph proto_diagram = (Graph)selectedTool;
			}
			mouseDownPoint = (Point2D) mouse.clone();
			lastMousePoint = (Point2D) mouse.clone();
		}};
	TouchMoveHandler touchMoveHandler = new TouchMoveHandler(){

		@Override
		public void onTouchMove(TouchMoveEvent event) {
			mouse.x = event.getNativeEvent().getClientX();
			mouse.y = event.getNativeEvent().getClientY();
			if(dragMode == DragMode.DRAG_MOVE) {
				double dx = mouse.getX() - lastMousePoint.getX();
				double dy = mouse.getY() - lastMousePoint.getY();
				if(selectedElement instanceof Node) ((Node)selectedElement).translate(dx, dy);
				lastMousePoint = (Point2D) mouse.clone();
				draw(0);
			}
			if(dragMode == DragMode.DRAG_RUBBERBAND) {
				draw(0);
			}
			if(dragMode == DragMode.DRAG_RANGE) {
				draw(0);
			}
		}};
	TouchEndHandler touchEndHandler = new TouchEndHandler(){

		@Override
		public void onTouchEnd(TouchEndEvent event) {
			mouse.x = event.getNativeEvent().getClientX();
			mouse.y = event.getNativeEvent().getClientY();
			if(dragMode == DragMode.DRAG_RUBBERBAND) {
				if(selectedTool instanceof Edge) {
					Edge proto_link = (Edge)selectedTool;
					Edge new_link = (Edge)proto_link.clone();
					diagram.addEdgeAtPoints(new_link, mouseDownPoint, mouse);
					draw(0);
					mToolPanel.SelectTool(0);
				}
			}
			if(dragMode == DragMode.DRAG_POINT && selectedElement instanceof Edge) {
				if(lastMousePoint.distanceSq(mouse) > 49) {
					((ShapeEdge)selectedElement).movepoint((Point2D)lastMousePoint.clone(), (Point2D)mouse.clone());
				}
				draw(0);
			}
			if(dragMode == DragMode.DRAG_RANGE) {
				selectedElements.clear();
				Rectangle2D rect = new Rectangle2D(lastMousePoint.x, lastMousePoint.y, mouse.x - lastMousePoint.x, mouse.y - lastMousePoint.y);
				for(Node node : diagram.getNodes()) {
					if(rect.contains(node.getBounds().x, node.getBounds().y, node.getBounds().width, node.getBounds().height)) {
						selectedElements.add(node);
					}
				}
//				this.diagram.getEdges()
			}
			if(dragMode == DragMode.DRAG_MOVE) {
				double dx = mouse.getX() - mouseDownPoint.getX();
				double dy = mouse.getY() - mouseDownPoint.getY();
				if(selectedElement instanceof Node) {
					diagram.fireNodeMoved((Node)selectedElement, dx, dy);
				}
			}
			dragMode = DragMode.DRAG_NONE;
		}};
	TouchCancelHandler touchCancelHandler = new TouchCancelHandler(){

		@Override
		public void onTouchCancel(TouchCancelEvent event) {
		}};
		
	*/
	
	@Override
	public Object getResource() {
		return this.diagram;
	}

	@Override
	public String getKey() {
		return key;
	}

}
