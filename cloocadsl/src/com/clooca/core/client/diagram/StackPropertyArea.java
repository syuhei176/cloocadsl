package com.clooca.core.client.diagram;

import com.google.gwt.dom.client.Style.Unit;
import com.google.gwt.user.client.ui.TabLayoutPanel;
import com.clooca.core.client.util.*;

public abstract class StackPropertyArea extends AbstractPropertyArea {
	
//	private TabLayoutPanel panel;
	private int DefaultSelectedTabIndex = 0;

	public StackPropertyArea() {
		super();
//		panel = new TabLayoutPanel(1.5, Unit.EM);

	}
	
	public void setDefaultSelectedTabIndex(int i) {
//		panel.selectTab(i);
		DefaultSelectedTabIndex = i;
	}
	
	public int getDefaultSelectedTabIndex() {
		return DefaultSelectedTabIndex;
	}
	/*
	public TabLayoutPanel getPanel() {
		return panel;
	}
	*/
	
	public void draw(GraphicManager gm, Rectangle2D r) {
//		if(!visible) return;
		if(getVisual_type() == VISUAL_TYPE.VISUAL_CASE) {
			int height = 0;
			AbstractPropertyArea[] palist = this.getProtoType();
			for(int i=0;i < palist.length;i++) {
				AbstractPropertyArea pa = palist[i];
//			for(AbstractPropertyArea pa : palist) {
				if(pa.isVisible()) {
					pa.draw(gm, new Rectangle2D(r.x, r.y + height, r.width, r.height - height));
					height += pa.getHeight();
					if(i != palist.length - 1) {
						gm.beginPath();
						gm.moveTo(new Point2D(r.x, r.y + height));
						gm.LineTo(new Point2D(r.x + r.width, r.y + height));
						gm.stroke();
						gm.closePath();
					}
				}
			}
		}else if(getVisual_type() == VISUAL_TYPE.VISUAL_LINE) {
			int height = 0;
			AbstractPropertyArea[] palist = this.getProtoType();
			for(AbstractPropertyArea pa : palist) {
				pa.draw(gm, new Rectangle2D(r.x, r.y + height, r.width, r.height - height));
				height += pa.getHeight();
			}
		}
		
	}
	
	public Rectangle2D getBound() {
		double max_w = 0;
		AbstractPropertyArea[] palist = this.getProtoType();
		for(AbstractPropertyArea pa : palist) {
			if(max_w < pa.getBound().getWidth()) {
				max_w = pa.getBound().getWidth();
			}
		}
		return new Rectangle2D(0, 0, max_w, getHeight());
	}
	
	public int getHeight() {
		int height = 0;
		AbstractPropertyArea[] palist = this.getProtoType();
		for(AbstractPropertyArea pa : palist) {
			if(pa.getProtoType() != null) {
				if(pa.isVisible()) height += pa.getHeight();
			}else{
				if(pa.isVisible()) height += pa.getHeight();
			}
		}
		return height;
	}
	
	public void hide_detail() {
		if(this.getVisual_type() == VISUAL_TYPE.VISUAL_CASE) {
			if(this.getProtoType().length == 2) {
				this.getProtoType()[1].setVisible(false);
			}
		}
	}
	
	public void show_detail() {
		if(this.getVisual_type() == VISUAL_TYPE.VISUAL_CASE) {
			if(this.getProtoType().length == 2) {
				this.getProtoType()[1].setVisible(true);
			}
		}
	}

}