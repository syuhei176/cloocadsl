package com.clooca.core.client.diagram;

import com.clooca.core.client.util.*;


/**
 * @author Syuhei Hiya
 *
 */
public abstract class AbstractPropertyArea {
	
	protected boolean visible;
	
	public enum VISUAL_TYPE {NOT_VISIBLE, VISUAL_CASE, VISUAL_LINE};
	
	private VISUAL_TYPE visual_type;
	
	public abstract void draw(GraphicManager gm, Rectangle2D r);
	
	abstract public AbstractPropertyArea[] getProtoType();
	
	abstract public String getName();
	
	abstract public Rectangle2D getBound();
	
	abstract public int getHeight();
	
	public AbstractPropertyArea() {
		this.visible = true;
	}
	
	public void setVisible(boolean visible) {
		this.visible = visible;
	}

	public boolean isVisible() {
		return visible;
	}

	public void setVisual_type(VISUAL_TYPE visual_type) {
		this.visual_type = visual_type;
	}

	public VISUAL_TYPE getVisual_type() {
		return visual_type;
	}
	
}
