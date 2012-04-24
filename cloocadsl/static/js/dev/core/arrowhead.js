function ArrowHead(type) {
	this.type = type;
	this.path = new Array();
}

ArrowHead.NONE = 0;
ArrowHead.V = 1;

ArrowHead.prototype.draw = function(canvas, p, q) {
    var dx = q.x - p.x;
    var dy = q.y - p.y;
    var angle = (Math.atan2(dy, dx)-Math.PI / 6) * 180 / Math.PI;
    if(this.type == ArrowHead.NONE) {
    	
    }else if(this.type == ArrowHead.V) {
		canvas.translateCanvas({x:q.x, y:q.y});
		canvas.rotateCanvas({
			  angle: angle+5,
			  x: 0, y: 0
			})
    	canvas.drawLine({
    		  strokeStyle: "#000",
    		  strokeWidth: 2,
    		  x1: -10, y1: -10,
    		  x2: 0, y2: 0,
    		  x3: -14, y3: 0
    		});
		canvas.restoreCanvas();
		canvas.restoreCanvas();
    }else if (this.type == ArrowHead.TRIANGLE){
    	canvas.drawPolygon({
    		strokeStyle: "#000",
  		  x: q.x, y: q.y,
  		  radius: 10,
  		  sides: 3,
  		  angle: angle
  		});
    }else if (this.type == ArrowHead.BLACK_TRIANGLE){
    	canvas.drawPolygon({
    		  fillStyle: "#000",
    		  x: q.x, y: q.y,
    		  radius: 10,
    		  sides: 3,
    		  angle: angle
    		});
    }else if (this.type == ArrowHead.DIAMOND){
    	canvas.drawPolygon({
    		strokeStyle: "#000",
  		  x: q.x, y: q.y,
  		  radius: 10,
  		  sides: 4,
  		  angle: angle
  		});
    }else if (this.type == ArrowHead.BLACK_DIAMOND){
    	canvas.drawPolygon({
  		  fillStyle: "#000",
  		  x: q.x, y: q.y,
  		  radius: 10,
  		  sides: 4,
  		  angle: angle
  		});
    }
}


ArrowHead.prototype.getPath = function(p, q) {
	var path = new Array();
    var ARROW_ANGLE = Math.PI / 6;
    var ARROW_LENGTH = 10;

    var dx = q.getX() - p.getX();
    var dy = q.getY() - p.getY();
    var angle = Math.atan2(dy, dx);
    var x1 = q.getX() - ARROW_LENGTH * Math.cos(angle + ARROW_ANGLE);
    var y1 = q.getY() - ARROW_LENGTH * Math.sin(angle + ARROW_ANGLE);
    var x2 = q.getX() - ARROW_LENGTH * Math.cos(angle - ARROW_ANGLE);
    var y2 = q.getY() - ARROW_LENGTH * Math.sin(angle - ARROW_ANGLE);

    if (type == ArrowType.V)
    {
		path.push(new Point2D(x1, y1));
        path.push(new Point2D(q.getX(), q.getY()));
        path.push(new Point2D(x2, y2));
        path.push(new Point2D(q.getX(), q.getY()));
        path.push(new Point2D(x1, y1));
    }
    else if (type == ArrowType.TRIANGLE || type == ArrowType.BLACK_TRIANGLE)
    {
        path.push(new Point2D(q.getX(), q.getY()));
        path.push(new Point2D(x1, y1));
        path.push(new Point2D(x2, y2));
    }
    else if (type == ArrowType.DIAMOND || type == ArrowType.BLACK_DIAMOND)
    {
        path.push(new Point2D(q.getX(), q.getY()));
        path.push(new Point2D(x1, y1));
        var x3 = x2 - ARROW_LENGTH * Math.cos(angle + ARROW_ANGLE);
        var y3 = y2 - ARROW_LENGTH * Math.sin(angle + ARROW_ANGLE);
        path.push(new Point2D(x3, y3));
        path.push(new Point2D(x2, y2));
    }
    return path;
}
