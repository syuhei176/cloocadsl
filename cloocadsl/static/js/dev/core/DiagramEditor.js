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
	var start = 0;
	var end = 0;
	if(rel.points.length == 0) {
		start = this.getConnectionPoint(new Line2D(s.x, s.y, e.x, e.y), src.bound);
		end = this.getConnectionPoint(new Line2D(e.x, e.y, s.x, s.y), dest.bound);
	}else if(rel.points.length > 0) {
		start = this.getConnectionPoint(new Line2D(s.x, s.y, rel.points[0].x, rel.points[0].y), src.bound);
		end = this.getConnectionPoint(new Line2D(e.x, e.y, rel.points[rel.points.length-1].x, rel.points[rel.points.length-1].y), dest.bound);
	}
	var points = [];
	points.push(start);
	points = points.concat(rel.points);
	points.push(end);
	for(var i=0;i < points.length-1;i++) {
		this.canvas.drawLine({
			  strokeStyle: col,
			  strokeWidth: 2,
			  strokeCap: "round",
			  strokeJoin: "miter",
			  x1: points[i].x, y1: points[i].y,
			  x2: points[i+1].x, y2: points[i+1].y
			});
	}
	var meta_ele = g_metamodel.metarelations[rel.meta_id];
	var arrow_type = meta_ele.arrow_type;
	if(arrow_type == 'v') {
		var ah = new ArrowHead(ArrowHead.V);
		ah.draw(this.canvas, start, end);
	}else{
		
	}
	var h = 0;
	for(var l=0;l < meta_ele.properties.length;l++) {
		var prop = null;
		for(var j=0;j<rel.properties.length;j++) {
			if(rel.properties[j].meta_id == meta_ele.properties[l]) {
				prop = rel.properties[j];
			}
		}
		if(prop != null) {
			for(var k=0;k < prop.children.length;k++) {
				var p = g_model.properties[prop.children[k]]
				if(p.ve.ver_type == 'delete') continue;
				this.canvas.drawText({
					  fillStyle: "#000",
					  x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 + h * 20,
					  text: p.value,
					  align: "center",baseline: "middle",font: "16px 'ＭＳ ゴシック'"
					});
				h++;
			}
		}
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
	return new Point2D(bound.x, bound.y);
}