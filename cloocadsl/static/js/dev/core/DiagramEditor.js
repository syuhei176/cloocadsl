function DiagramViewer() {}

DiagramEditor.prototype.draw_relationship = function(rel) {
	var col = '#000';
	if(rel == this.selected) {
		col = '#00f';
	}
	var src = ModelController.getObject(this.diagram, rel.src);
	var dest = ModelController.getObject(this.diagram, rel.dest);
	var s = new Point2D((src.bound.x + src.bound.width / 2), (src.bound.y + src.bound.height / 2));
	var e = new Point2D((dest.bound.x + dest.bound.width / 2), (dest.bound.y + dest.bound.height / 2));
	var start = this.getConnectionPoint(new Line2D(s.x, s.y, e.x, e.y), src.bound);
	var end = this.getConnectionPoint(new Line2D(e.x, e.y, s.x, s.y), dest.bound);
	this.canvas.drawLine({
		  strokeStyle: col,
		  strokeWidth: 2,
		  strokeCap: "round",
		  strokeJoin: "miter",
		  x1: start.x, y1: start.y,
		  x2: end.x, y2: end.y
		});
	var arrow_type = g_metamodel.metarelations[rel.meta_id].arrow_type;
	if(arrow_type == 'v') {
		console.log(arrow_type)
		var ah = new ArrowHead(ArrowHead.V);
		ah.draw(this.canvas, start, end);
	}else{
		
	}

}

DiagramEditor.prototype.getConnectionPoint = function(d, bound) {
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