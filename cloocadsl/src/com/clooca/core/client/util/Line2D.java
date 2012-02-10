package com.clooca.core.client.util;

public class Line2D  implements Cloneable {
	 public double x1;

     public double y1;

     public double x2;

     public double y2;
     
     public Line2D(double x1, double y1, double x2, double y2) {
         setLine(x1, y1, x2, y2);
     }

     public Line2D(Point2D p1, Point2D p2) {
         setLine(p1, p2);
     }

     public double getX1() {
         return x1;
     }

     public double getY1() {
         return y1;
     }

     public Point2D getP1() {
         return new Point2D(x1, y1);
     }

     public double getX2() {
         return x2;
     }

     public double getY2() {
         return y2;
     }

     public Point2D getP2() {
         return new Point2D(x2, y2);
     }

     public void setLine(double x1, double y1, double x2, double y2) {
         this.x1 = x1;
         this.y1 = y1;
         this.x2 = x2;
         this.y2 = y2;
     }

     public Rectangle2D getBounds2D() {
         double x, y, w, h;
         if (x1 < x2) {
             x = x1;
             w = x2 - x1;
         } else {
             x = x2;
             w = x1 - x2;
         }
         if (y1 < y2) {
             y = y1;
             h = y2 - y1;
         } else {
             y = y2;
             h = y1 - y2;
         }
         return new Rectangle2D(x, y, w, h);
     }
     
     protected Line2D() {
    	 
     }
     public void setLine(Point2D p1, Point2D p2) {
    	 setLine(p1.getX(), p1.getY(), p2.getX(), p2.getY());
    	 }

     public void setLine(Line2D l) {
    	 setLine(l.getX1(), l.getY1(), l.getX2(), l.getY2());
     }
     
     public Point2D getConnect(Line2D l) {
    	 double dBunbo	= (getX2() - getX1() )
    	 		* ( l.getY2() - l.getY1() )
    	 		- ( getY2() - getY1() )
    	 		* ( l.getX2() - l.getX1());
    	 
    	 if( 0 == dBunbo )
    	 {
    		 return null;
    	 }
    	 
    	 Point2D vectorAC = new Point2D(l.getX1() - getX1(), l.getY1() - getY1());
    	 
    	 double dR = ( ( l.getY2() - l.getY1() ) * vectorAC.x - ( l.getX2() - l.getX1() ) * vectorAC.y ) / dBunbo;
//    	 double dS = ( ( getY2() - getY1() ) * vectorAC.x - ( getX2() - getX1() ) * vectorAC.y ) / dBunbo;
    	 
    	 return new Point2D(getX1() + dR * (getX2() - getX1()), getY1() + dR * (getY2() - getY1()));
     }

     public static int relativeCCW(double x1, double y1,
             double x2, double y2,
             double px, double py)
     {
    	 x2 -= x1;
    	 y2 -= y1;
    	 px -= x1;
    	 py -= y1;
    	 double ccw = px * y2 - py * x2;
    	 if (ccw == 0.0) {
    		 ccw = px * x2 + py * y2;
    		 if (ccw > 0.0) {
    			 px -= x2;
    			 py -= y2;
    			 ccw = px * x2 + py * y2;
    			 if (ccw < 0.0) {
    				 ccw = 0.0;
    			 }
    		 }
    	 }
    	 return (ccw < 0.0) ? -1 : ((ccw > 0.0) ? 1 : 0);
     }
     
     public int relativeCCW(double px, double py) {
    	 return relativeCCW(getX1(), getY1(), getX2(), getY2(), px, py);
     }
     
     public int relativeCCW(Point2D p) {
    	 return relativeCCW(getX1(), getY1(), getX2(), getY2(),
    	       p.getX(), p.getY());
    	 }
     
     public static boolean linesIntersect(double x1, double y1,
             double x2, double y2,
             double x3, double y3,
             double x4, double y4)
     {
		return ((relativeCCW(x1, y1, x2, y2, x3, y3) *
		relativeCCW(x1, y1, x2, y2, x4, y4) <= 0)
		&& (relativeCCW(x3, y3, x4, y4, x1, y1) *
		relativeCCW(x3, y3, x4, y4, x2, y2) <= 0));
     }
     
	public boolean intersectsLine(double x1, double y1, double x2, double y2) {
		return linesIntersect(x1, y1, x2, y2,
	         getX1(), getY1(), getX2(), getY2());
	}
	
	public boolean intersectsLine(Line2D l) {
		return linesIntersect(l.getX1(), l.getY1(), l.getX2(), l.getY2(),
	         getX1(), getY1(), getX2(), getY2());
	}
	
	
	public static double ptSegDistSq(double x1, double y1,
	                double x2, double y2,
	                double px, double py)
	{
		x2 -= x1;
		y2 -= y1;
		px -= x1;
		py -= y1;
		double dotprod = px * x2 + py * y2;
		double projlenSq;
		if (dotprod <= 0.0) {
			projlenSq = 0.0;
		} else {
			px = x2 - px;
			py = y2 - py;
			dotprod = px * x2 + py * y2;
			if (dotprod <= 0.0) {
				projlenSq = 0.0;
			} else {
				projlenSq = dotprod * dotprod / (x2 * x2 + y2 * y2);
			}
		}
		double lenSq = px * px + py * py - projlenSq;
		if (lenSq < 0) {
			lenSq = 0;
		}
		return lenSq;
	}
	
	
	public static double ptSegDist(double x1, double y1,
	              double x2, double y2,
	              double px, double py)
	{
		return Math.sqrt(ptSegDistSq(x1, y1, x2, y2, px, py));
	}
	
	public double ptSegDistSq(double px, double py) {
		return ptSegDistSq(getX1(), getY1(), getX2(), getY2(), px, py);
	}
	
	
	public double ptSegDistSq(Point2D pt) {
		return ptSegDistSq(getX1(), getY1(), getX2(), getY2(),
	      pt.getX(), pt.getY());
	}
	
	
	public double ptSegDist(double px, double py) {
		return ptSegDist(getX1(), getY1(), getX2(), getY2(), px, py);
	}
	
	
	public double ptSegDist(Point2D pt) {
		return ptSegDist(getX1(), getY1(), getX2(), getY2(),
	    pt.getX(), pt.getY());
	}
	
	
	public static double ptLineDistSq(double x1, double y1,
	                 double x2, double y2,
	                 double px, double py)
	{
		x2 -= x1;
		y2 -= y1;
		px -= x1;
		py -= y1;
		double dotprod = px * x2 + py * y2;
		double projlenSq = dotprod * dotprod / (x2 * x2 + y2 * y2);
		double lenSq = px * px + py * py - projlenSq;
		if (lenSq < 0) {
			lenSq = 0;
		}
		return lenSq;
	}
	
	
	public static double ptLineDist(double x1, double y1,
	               double x2, double y2,
	               double px, double py)
	{
		return Math.sqrt(ptLineDistSq(x1, y1, x2, y2, px, py));
	}
	
	
	public double ptLineDistSq(double px, double py) {
		return ptLineDistSq(getX1(), getY1(), getX2(), getY2(), px, py);
	}
	
	
	public double ptLineDistSq(Point2D pt) {
		return ptLineDistSq(getX1(), getY1(), getX2(), getY2(),
				pt.getX(), pt.getY());
	}
	public double ptLineDist(double px, double py) {
		return ptLineDist(getX1(), getY1(), getX2(), getY2(), px, py);
	}
	public double ptLineDist(Point2D pt) {
		return ptLineDist(getX1(), getY1(), getX2(), getY2(),
				pt.getX(), pt.getY());
	}
	
	
	public boolean contains(double x, double y) {
		return false;
	}
	
	public boolean contains(Point2D p) {
		return false;
	}
	
	/**
	* {@inheritDoc}
	* @since 1.2
	*/
	public boolean intersects(double x, double y, double w, double h) {
		return intersects(new Rectangle2D(x, y, w, h));
	}
	
	public boolean intersects(Rectangle2D r) {
		return r.intersectsLine(getX1(), getY1(), getX2(), getY2());
	}
	
	
	public boolean contains(double x, double y, double w, double h) {
		return false;
	}
	
	public boolean contains(Rectangle2D r) {
		return false;
	}
	
	public Rectangle2D getBounds() {
		return getBounds2D();
	}
	
	public Object clone() {
		return new Line2D(x1, y1, x2, y2);
	}

}

 
