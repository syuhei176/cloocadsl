package com.clooca.core.client.util;

import com.google.gwt.canvas.dom.client.Context2d;
import com.google.gwt.dom.client.ImageElement;

public class GraphicManager {
	
	private Context2d context;
	
	
	private int fontSize;
	private String fontStyle;
	private int fontHeight;
	private int fontWidth;
	private int fontHeightMargin;
	
	public GraphicManager(Context2d context) {
		this.context = context;
		initFont();
		this.setLineWidth(2);
		this.context.setFont(String.valueOf(fontSize) + "px " + fontStyle);
	}
	
	private void initFont()
	{
		fontSize = 14;
		fontStyle = "'ＭＳ Ｐゴシック'";
		fontHeight = 16;
		fontWidth = 16;
		fontHeightMargin = 2;
	}
	
	public void setLineWidth(int n) {
		context.setLineWidth(n);
	}
	
	public void setColor(String color) {
		context.setStrokeStyle(color);
	}

	public void StrokeRect(Rectangle2D r) {
		context.strokeRect(r.x, r.y, r.width, r.height);
	}
	
    public void StrokeRoundRect(Rectangle2D rect, int r)
    {
		context.beginPath();
		context.arc(rect.x + r, rect.y + r, r, - Math.PI, - 0.5 * Math.PI, false);
		context.arc(rect.x + rect.width - r, rect.y + r, r, - 0.5 * Math.PI, 0, false);
		context.arc(rect.x + rect.width - r, rect.y + rect.height - r, r, 0, 0.5 * Math.PI, false);
		context.arc(rect.x + r, rect.y + rect.height - r, r, 0.5 * Math.PI, Math.PI, false);
		context.closePath();
		context.stroke();
    }
	
	public void beginPath() {
		context.beginPath();
	}
	
	public void closePath() {
		context.closePath();
	}
	
	public void stroke() {
		context.stroke();
	}
	
	public void clearRect(Rectangle2D r) {
		context.clearRect(r.x, r.y, r.width, r.height);
	}
	
	public void moveTo(Point2D p) {
		context.moveTo(p.x, p.y);
	}
	
	public void LineTo(Point2D p) {
		context.lineTo(p.x, p.y);
	}
	
	public void drawLine(Line2D l) {
		context.moveTo(l.x1, l.y1);
		context.lineTo(l.x2, l.y2);
	}
	
	public void StrokeCircle(Point2D p, double radius) {
		context.beginPath();
		context.arc(p.x, p.y, radius, 0, 2*Math.PI, false);
		context.stroke();
		context.closePath();
	}

	public void FillCircle(Point2D p, double radius) {
		context.beginPath();
		context.arc(p.x, p.y, radius, 0, 2*Math.PI, false);
		context.fill();
		context.closePath();
	}

	public void DrawText(String text, int x, int y, int maxWidth) {
		context.fillText(text, x, y, maxWidth);
	}

	public void DrawTextMultiLine(String text, int x, int y) {
		String[] line = text.split("\n");
		int yy = y;
		for(String s : line) {
			context.fillText(s, x, yy);
			yy += fontSize;
		}
	}

	public void DrawTextMultiLine(String text, int x, int y, int maxWidth) {
		String[] line = text.split("\n");
		int yy = y;
		for(String s : line) {
			context.fillText(s, x, yy, maxWidth);
			yy += fontSize;
		}
	}
	
	public void DrawImage(ImageElement img, double x, double y) {
		context.drawImage(img, x, y);
	}
	
	
	//Setter and Getter
	public int getFontSize() {
		return fontSize;
	}
	public void setFontSize(int fontSize) {
		this.fontSize = fontSize;
	}
	public String getFontStyle() {
		return fontStyle;
	}
	public void setFontStyle(String fontStyle) {
		this.fontStyle = fontStyle;
	}
	
	public int getFontHeight() {
		return fontHeight;
	}
	public int getFontWidth() {
		return fontWidth;
	}
	public int getFontHeightMargin() {
		return fontHeightMargin;
	}

}
 
