package com.clooca.core.client.model.gopr.metaelement;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.util.Point2D;

public class GraphicInfo {
	public int id;
	public String shape;
	public String color;
	public static final String RECT = "rect";
	public static final String ROUNDED = "rounded";
	public static final String CIRCLE = "circle";
	public static final String PATH = "path";
	public List<Point2D> path = new ArrayList<Point2D>();
}
