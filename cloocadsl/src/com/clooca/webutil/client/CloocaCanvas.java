package com.clooca.webutil.client;

import com.google.gwt.canvas.client.Canvas;
import com.google.gwt.core.client.JavaScriptObject;
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
import com.google.gwt.user.client.ui.RootPanel;

public class CloocaCanvas  implements MouseDownHandler,MouseUpHandler,MouseMoveHandler,ClickHandler, DoubleClickHandler {
	static private Canvas canvas;
	
	static public native void setup() /*-{
		$wnd.set_canvas = function(tag) {
			@com.clooca.webutil.client.CloocaCanvas::setCanvas(Ljava/lang/String;)(tag);
		}
	}-*/;
	
	private void init() {
		canvas = Canvas.createIfSupported();
		canvas.setCoordinateSpaceWidth(320);
		canvas.setCoordinateSpaceHeight(320);
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
	}
	
	static public void setCanvas(String tag) {
		RootPanel.get(tag).add(canvas);
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
		// TODO Auto-generated method stub
		
	}
	@Override
	public void onMouseUp(MouseUpEvent event) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void onMouseDown(MouseDownEvent event) {
		// TODO Auto-generated method stub
		
	}

}
