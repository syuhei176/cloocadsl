/**
 * 
 * @param name 名前
 * @param key　唯一のキー
 */
function SequenceEditor(name, key, diagram) {
	this.name = name;
	this.key = key;
	this.diagram = diagram;
	this.diagramController = new DiagramController(this.diagram);
	this.tool = null;
	this.drag_start = new Point2D();
	this.drag_move = new Point2D();
	this.drag_end = new Point2D();
	this.selected = null;
	this.dragMode = 0;
	this.select_button = null;
	var self = this;
	this.diagramController.on('updateProperty', function(p, newValue, parent){
		if(parent.bound != undefined) calObjHeight(parent);
		self.draw();
	});
	
	this.width = 1000;
	this.height = 1000;
	this.panel = {
			id: this.key,
			title: name,
			autoScroll: true,
			html : '<canvas id="canvas_'+this.key+'" width='+this.width+' height='+this.height+'></canvas>',
			closable: 'true',
		};
	this.canvas = $('#canvas_'+this.key);
}

SequenceEditor.prototype.draw = function() {
	var self = this;
	if(self.canvas == null) {
		self.canvas = $('#canvas_'+self.key);
	}
	self.canvas.drawRect({fillStyle: "#fff",x: 0, y: 0,width: self.width,height: self.height, fromCenter: false});
	for(var i=0;i < self.diagram.objects.length;i++) {
		var obj_id = self.diagram.objects[i];
		var obj = g_model.objects[obj_id];
		if(obj.ve.ver_type == 'delete') continue;
		var col = '#000';
		if(obj == self.selected) {
			col = '#00f';
		}
		var meta_ele = g_metamodel.metaobjects[obj.meta_id];
		if(meta_ele.graphic == null || meta_ele.graphic == 'rect') {
			self.canvas.drawRect({
				  strokeStyle: col, strokeWidth: 1,
				  x: obj.bound.x, y: obj.bound.y,
				  width: obj.bound.width, height: obj.bound.height,
				  fromCenter: false
			});
		}else if(meta_ele.graphic == 'rounded') {
			self.canvas.drawRect({
				  strokeStyle: col, strokeWidth: 2,
				  x: obj.bound.x, y: obj.bound.y,
				  width: obj.bound.width, height: obj.bound.height,
				  fromCenter: false,
				  cornerRadius: 5
			});
		}else if(meta_ele.graphic == 'circle') {
			$("canvas").drawArc({
				  strokeStyle: col, strokeWidth: 2,
				  x: obj.bound.x + obj.bound.width / 2, y: obj.bound.y + obj.bound.width / 2,
				  radius: obj.bound.width / 2,
				  start: 0, end: 359,
				  fromCenter: true
				});
		}else{
			var graphic = g_metamodel['graphics'][meta_ele.graphic];
			graphic.option.col = col;
			if(graphic.type == 'polygon') {
				self.canvas.translateCanvas({
					  x: obj.bound.x + obj.bound.width / 2, y: obj.bound.y + obj.bound.height / 2,
					})
				self.canvas.scaleCanvas({
					x:0, y:0,
					scaleX: obj.bound.width / 50, scaleY: obj.bound.height / 50
					})
				self.canvas.drawPolygon(graphic.option);
				self.canvas.restoreCanvas();
				self.canvas.restoreCanvas();
			}else if(graphic.type == 'lines') {
				self.canvas.translateCanvas({
					  x: obj.bound.x + obj.bound.width / 2, y: obj.bound.y + obj.bound.width / 2,
				}).drawLine(graphic.option).restoreCanvas();
			}
		}
		/*
		 * for resizable object
		 */
		if(meta_ele.resizable == true && obj == self.selected) {
			self.canvas.drawRect({
				  fillStyle: "#00f", strokeWidth: 2,
				  x: obj.bound.x+obj.bound.width-12, y: obj.bound.y+obj.bound.height-12,
				  width: 12, height: 12,
				  fromCenter: false
			});
		}

		var h = 0;
		for(var l=0;l < meta_ele.properties.length;l++) {
			var prop = null;
			for(var j=0;j<obj.properties.length;j++) {
				if(obj.properties[j].meta_id == meta_ele.properties[l]) {
					prop = obj.properties[j];
				}
			}
			if(prop != null) {
				for(var k=0;k < prop.children.length;k++) {
					var p = g_model.properties[prop.children[k]]
					if(p.ve.ver_type == 'delete') continue;
					var disp_text = p.value;
					var meta_prop = g_metamodel.metaproperties[prop.meta_id];
					if(meta_prop.widget == MetaProperty.FIXED_LIST) {
						for(var index=0;index < meta_prop.exfield.length;index++) {
							if(p.value == meta_prop.exfield[index].value) {
								disp_text = meta_prop.exfield[index].disp;
							}
						}
					}
					self.canvas.drawText({
						  fillStyle: "#000",
						  x: obj.bound.x+obj.bound.width / 2, y: obj.bound.y + h * 20 + 20,
						  text: disp_text,
						  align: "center",
						  baseline: "middle",
						  font: "16px 'ＭＳ ゴシック'"
						});
					h++;
				}
				if(meta_ele.properties.length-1 != l) {
					self.canvas.drawLine({
						  strokeStyle: "#000",
						  strokeWidth: 2,
						  x1: obj.bound.x, y1: obj.bound.y + h * 20 + 10,
						  x2: obj.bound.x+obj.bound.width, y2: obj.bound.y + h * 20 + 10
						});
				}
			}
		}
	}
	for(var i=0;i < self.diagram.relationships.length;i++) {
		var rel_id = self.diagram.relationships[i];
		var rel = g_model.relationships[rel_id];
		if(rel.ve.ver_type == 'delete') continue;
		self.draw_relationship(rel);
	}
	if(self.tool != null) {
		self.canvas.drawText({
			  fillStyle: "#000",
			  x: self.drag_move.x, y: self.drag_move.y,
			  text: self.tool.name,
			  align: "center",
			  baseline: "middle",
			  font: "16px 'ＭＳ ゴシック'"
			});
	}
	if(self.dragMode == SequenceEditor.DRAG_RUBBERBAND) {
		self.canvas.drawLine({
			  strokeStyle: "#777",
			  strokeWidth: 2,
			  strokeCap: "round",
			  strokeJoin: "miter",
			  x1: self.drag_start.x, y1: self.drag_start.y,
			  x2: self.drag_move.x, y2: self.drag_move.y
			});

	}
}

SequenceEditor.prototype.getPanel = function() {
	return this.panel;
}

SequenceEditor.prototype.Initialize = function() {
	var self = this;
	this.canvas = $('#canvas_'+this.key);
	var mnuContext = new Ext.menu.Menu({
	    items: [{
	        id: 'delete_element',
	        text: '削除'
	    },{
	        id: 'delete_point',
	        text: 'ポイントを削除'
	    },{
	        id: 'up_step',
	        text: '一つ上へ'
	    },{
	        id: 'down_step',
	        text: '一つ下へ'
	    },{
	        id: 'info',
	        text: '情報'
	    }],
	    listeners: {
	        itemclick: function(item) {
	            switch (item.id) {
	                case 'delete_element':
	                	self.deleteSelected();
	                    break;
	                case 'delete_point':
	                	self.deletePoint();
	                    break;
	            }
	        },
        click: function(menu, item) {
            switch (item.id) {
                case 'delete_element':
                	self.deleteSelected();
                    break;
                case 'delete_point':
                	self.deletePoint();
                    break;
                case 'up_step':
                	self.up_step();
                    break;
                case 'down_step':
                	self.down_step();
                    break;
                case 'info':
                	self.info();
                    break;
            }
        }
	    }
	});
	
	if(navigator.userAgent.indexOf('iPad') > 0) {
		this.canvas.touchmove(function(e){
			var rect = e.target.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = e.clientY - rect.top;
			self.ActionMove(mouseX, mouseY)
		});
		this.canvas.touchstart(function(e){
			var rect = e.target.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = e.clientY - rect.top;
			if(e.button == 2) {
				mnuContext.showAt(e.clientX, e.clientY);
			}else{
				self.ActionDown(mouseX, mouseY)
				self.draw();
			}
		});
		this.canvas.touchend(function(e){
			var rect = e.target.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = e.clientY - rect.top;
			self.ActionUp(mouseX, mouseY)
			self.draw();
		});
	}else{
		this.canvas.mousemove(function(e){
			var rect = e.target.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = e.clientY - rect.top;
			self.ActionMove(mouseX, mouseY)
		});
		this.canvas.mousedown(function(e){
			var rect = e.target.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = e.clientY - rect.top;
			if(e.button == 2) {
				mnuContext.showAt(e.clientX, e.clientY);
			}else{
				self.ActionDown(mouseX, mouseY)
				self.draw();
			}
		});
		this.canvas.mouseup(function(e){
			var rect = e.target.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = e.clientY - rect.top;
			self.ActionUp(mouseX, mouseY)
			self.draw();
		});
	}
	this.draw();
}

SequenceEditor.prototype.onActivate = function() {
	this.createButton();
	current_editor = this;
}

/**
 * static変数
 */
SequenceEditor.DRAG_NONE = 0;
SequenceEditor.DRAG_RUBBERBAND = 1;
SequenceEditor.DRAG_MOVE = 2;
SequenceEditor.DRAG_POINT = 3;
SequenceEditor.DRAG_RANGE = 4;
SequenceEditor.DRAG_RESIZE = 5;

SequenceEditor.prototype.ActionMove = function(x, y) {
	this.drag_move.x = x;
	this.drag_move.y = y;
	if(this.dragMode == SequenceEditor.DRAG_MOVE) {
		if(this.selected != null) {
			this.updateObject(this.selected,Number(x-10),Number(y-10));
			this.draw()
		}
	}else if(this.dragMode == SequenceEditor.DRAG_RUBBERBAND) {
		this.draw()
	}else if(this.dragMode == SequenceEditor.DRAG_RESIZE) {
		this.selected.bound.width = this.drag_move.x - this.selected.bound.x;
		this.selected.bound.height = this.drag_move.y - this.selected.bound.y;
		if(this.selected.bound.width < 5) this.selected.bound.width = 5;
		this.draw()
	}else{
		
	}
}

SequenceEditor.prototype.updateObject = function(obj, x, y) {
	var meta_ele = g_metamodel.metaobjects[obj.meta_id];
	if(meta_ele.seq) {
		obj.bound.x = x - 10;
		obj.bound.y = 100;
	}else{
		obj.bound.x = x - 10;
		obj.bound.y = y - 10;
	}
	VersionElement.update(obj.ve);
}

SequenceEditor.prototype.ActionDown = function(x, y) {
	if(this.tool == null) {
		if(this.clicknode(Number(x), Number(y))) {
			if(this.dragMode != SequenceEditor.DRAG_RESIZE) this.dragMode = SequenceEditor.DRAG_MOVE;
		}else if(this.clickedge(x, y)) {
//			this.dragMode = SequenceEditor.DRAG_POINT;
		}else{
			this.dragMode = SequenceEditor.DRAG_NONE;
			this.selected = null;
		}
	}else if(this.tool.classname == 'MetaObject'){
		var obj = this.diagramController.addObject(x, y, this.tool.id);
		var meta_ele = g_metamodel.metaobjects[obj.meta_id];
		if(meta_ele.seq) {
			obj.bound.width = 16;
			obj.bound.height = 300;
		}
		this.select_button.toggle(true, false);
	}else if(this.tool.classname == 'MetaRelation'){
		this.dragMode = SequenceEditor.DRAG_RUBBERBAND;
	}
	this.drag_start.x = x;
	this.drag_start.y = y;
}

SequenceEditor.prototype.ActionUp = function(x, y) {
	this.drag_end.x = x;
	this.drag_end.y = y;
	if(this.dragMode == SequenceEditor.DRAG_RUBBERBAND) {
		var rel = this.diagramController.addRelationship(this.drag_start, this.drag_end, this.tool.id);
		g_model.properties[rel.properties[0].children[0]].value = Number(this.drag_start.y - 200);
		this.select_button.toggle(true);
	} else if(this.dragMode == SequenceEditor.DRAG_POINT) {
		this.movePoint(this.selected, this.drag_start, this.drag_end);
	}
	this.dragMode = SequenceEditor.DRAG_NONE;
}

SequenceEditor.prototype.deletePoint = function() {
	var rel = this.selected;
	if(rel == null) return;
	rel.points.length = 0;
}

SequenceEditor.prototype.movePoint = function(rel, s, d) {
	if(rel != null) {
		var yy = d.y - s.y;
		//TODO START
		var prop = null;
		for(var i=0;i < rel.properties.length;i++) {
			if(rel.properties[i].meta_id == 4) {
				prop = rel.properties[i];
			}
		}
		//TODO END
		g_model.properties[prop.children[0]].value = Number(g_model.properties[prop.children[0]].value) + Number(yy);
	}
}

SequenceEditor.prototype.clicknode = function(x, y) {
	var obj = this.diagramController.findNode(new Point2D(x, y));
	if(obj != null) {
		if(obj == this.selected) {
			if(Rectangle2D.contains(new Rectangle2D(obj.bound.x+obj.bound.width-12, obj.bound.y+obj.bound.height-12, 12, 12), new Point2D(x, y))) {
				this.dragMode = SequenceEditor.DRAG_RESIZE;
			}
		}
		if(obj.ve.ver_type == "delete") return false;
		this.selected = obj;
		this.fireSelectObject(this.selected);
		return true;
	}
	/*
	for(var i=0;i < this.diagram.objects.length;i++) {
		if(this.diagram.objects[i].x < x &&  x < this.diagram.objects[i].x + 50) {
			if(this.diagram.objects[i].y < y && y < this.diagram.objects[i].y + 50) {
				this.selected = this.diagram.objects[i];
				return true;
			}
		}
	}
	*/
	return false;
}

SequenceEditor.prototype.clickedge = function(x, y) {
	for(var i=0;i < this.diagram.relationships.length;i++) {
		if(this.click_a_edge(g_model.relationships[this.diagram.relationships[i]], x, y)) return true;
	}
	return false;
}

SequenceEditor.prototype.click_a_edge = function(rel, x, y) {
	if(rel.ve.ver_type == "delete") return false;
	var points = new Array();
	var src = ModelController.getObject(this.diagram, rel.src);
	var dest = ModelController.getObject(this.diagram, rel.dest);
	var s = new Point2D((src.bound.x + src.bound.width / 2), (src.bound.y + src.bound.height / 2));
	var e = new Point2D((dest.bound.x + dest.bound.width / 2), (dest.bound.y + dest.bound.height / 2));
	//TODO START
	var prop = null;
	for(var i=0;i < rel.properties.length;i++) {
		if(rel.properties[i].meta_id == 4) {
			prop = rel.properties[i];
		}
	}
	//TODO END
	s.y = Number(g_model.properties[prop.children[0]].value) + 200;
	e.y = s.y;
//	e.y += Number(g_model.properties[rel.properties[0].children[0]].value);
	points.push(s);
	points = points.concat(rel.points);
	points.push(e);
	for(var i=0;i < points.length - 1;i++) {
		if((new Line2D(points[i].x, points[i].y, points[i+1].x, points[i+1].y)).ptSegDist(x, y) < 16) {
			if(rel == this.selected) this.dragMode = SequenceEditor.DRAG_POINT;
			this.selected = rel;
			this.fireSelectRelationship(this.selected);
			return true;
		}
	}
	return false;
}

SequenceEditor.prototype.createButton = function() {
	var self = this;
	var toolpanel = Ext.getCmp('toolpanel');
	toolpanel.removeAll();
	var tools = [];
	this.metadiagram = g_metamodel.metadiagrams[this.diagram.meta_id];
	for(var i=0;i < this.metadiagram.metaobjects.length;i++) {
		tools.push(g_metamodel.metaobjects[this.metadiagram.metaobjects[i]]);
	}
	for(var i=0;i < this.metadiagram.metarelations.length;i++) {
		tools.push(g_metamodel.metarelations[this.metadiagram.metarelations[i]]);
	}
	/*
	 * selectツールを追加
	 */
	tools.unshift(null);
	for(var i=0;i < tools.length;i++) {
		var button_text = '';
		if(tools[i] == null) {
			button_text = 'select';
		}else{
			button_text = tools[i].name;
		}
		var b = Ext.create('Ext.Button', {
		    text     : button_text,
/*		    renderTo : Ext.get('toolpanel'),*/
		    width: 100,
		    height: 32,
		    enableToggle: true,
		    toggleGroup: 'tools',
		    listeners: {
		        click: function() {
		        	/*
		    		var tool = tools[this.index];
		            self.tool = tool;
		            */
		        },
		        toggle: function(b, state) {
		        	if(state) {
			    		var tool = tools[this.index];
			            self.tool = tool;
		        	}
		        },
		        mouseover: function() {
		            // this == the button, as we are in the local scope
		        }
		    }
		});
		if(b.text == 'select') this.select_button = b;
		b.index = i;

		toolpanel.add(b);
//		b.render('toolpanel');
	}
//	toolpanel.render('toolpanel');
//	Ext.getCmp('toolpanel').add(toolpanel);
}

/**
 * deleteSelected: 要素を削除する。要素はObjectかRelationshipのいずれか
 */
SequenceEditor.prototype.deleteSelected = function() {
	if(this.selected != null) {
		for(var i=0;i < this.diagram.objects.length;i++) {
			if(this.diagram.objects[i] == this.selected.id) {
				this.diagramController.deleteObject(this.selected.id);
			}
		}
		for(var i=0;i < this.diagram.relationships.length;i++) {
			if(this.diagram.relationships[i] == this.selected.id) {
				this.diagramController.deleteRelationship(this.selected.id);
			}
		}
		this.draw();
	}
}

SequenceEditor.prototype.info = function() {
	if(this.selected != null) {
		var str = 'ver_type='+this.selected.ve.ver_type;
		str += '<br>version='+this.selected.ve.version;
		str += '<br>id='+this.selected.id;
		str += '<br>pid='+Math.floor(this.selected.id / 10000);
		if(this.selected.ofd != undefined) str += '<br>z='+this.selected.ofd.z;
		console.log(str);
//		Ext.MessageBox.alert(str);
		Ext.getCmp('element-infomation').removeAll();
		Ext.getCmp('element-infomation').add({
			html: str
		});
	}
}

SequenceEditor.prototype.up_step = function() {
	if(this.selected.ofd != undefined) {
		for(var i=0;i < this.diagram.objects.length;i++) {
			var obj_id = this.diagram.objects[i];
			var obj = g_model.objects[obj_id];
			if(obj.ofd.z == this.selected.ofd.z + 1) {
				obj.ofd.z--;
			}
		}
		if(this.selected != null) {
			this.selected.ofd.z++;
		}
	}else if(this.selected.rfd != undefined) {
		for(var i=0;i < this.diagram.relationships.length;i++) {
			var rel_id = this.diagram.relationships[i];
			var rel = g_model.relationships[rel_id];
			if(rel.rfd.z == this.selected.rfd.z + 1) {
				rel.rfd.z--;
			}
		}
		if(this.selected != null) {
			this.selected.rfd.z++;
		}
	}
}

SequenceEditor.prototype.down_step = function() {
	if(this.selected.ofd != undefined) {
		for(var i=0;i < this.diagram.objects.length;i++) {
			var obj_id = this.diagram.objects[i];
			var obj = g_model.objects[obj_id];
			if(obj.ofd.z == this.selected.ofd.z - 1) {
				obj.ofd.z++;
			}
		}
		if(this.selected != null) {
			this.selected.ofd.z--;
			console.log('down');
		}
	}else if(this.selected.rfd != undefined) {
		for(var i=0;i < this.diagram.relationships.length;i++) {
			var rel_id = this.diagram.relationships[i];
			var rel = g_model.relationships[rel_id];
			if(rel.rfd.z == this.selected.rfd.z - 1) {
				rel.rfd.z++;
			}
		}
		if(this.selected != null) {
			this.selected.rfd.z--;
		}
	}
}

/*
function addRelationship(src, dest) {
	rel = new Relationship(this.tool.id);
	rel.src = src;
	rel.dest = dest;
}
*/

SequenceEditor.prototype.fireSelectObject = function(selected) {
	var meta_obj = MetaModelController.getMetaObject(g_metamodel.metadiagram, selected.meta_id)
	this.createPropertyPanel(meta_obj, selected);
	this.info()
}

SequenceEditor.prototype.fireSelectRelationship = function(selected) {
	var meta_rel = MetaModelController.getMetaRelation(g_metamodel.metadiagram, selected.meta_id)
	this.createPropertyPanel(meta_rel, selected);
	this.info()
}

/**
 * createPropertyPanel
 * プロパティパネルを作成する
 * @param meta_ele
 * @param ele
 */
SequenceEditor.prototype.createPropertyPanel = function(meta_ele, ele) {
	var meta_prop_id = null;
	if(arguments.length == 3) {
		meta_prop_id = arguments[2];
	}
	var self = this;
	Ext.getCmp('propertypanel').removeAll();
	var property_tabs = Ext.create('Ext.tab.Panel', {
	    items: []
	});
	for(var i=0;i < meta_ele.properties.length;i++) {
		var meta_prop = g_metamodel.metaproperties[meta_ele.properties[i]];
		var prop = null;
		for(var j=0;j<ele.properties.length;j++) {
			if(ele.properties[j].meta_id == meta_ele.properties[i]) {
				prop = ele.properties[j];
			}
		}
		if(prop == null) {
			plist = new PropertyList();
			plist.meta_id = meta_prop.id;
			if(meta_prop.data_type != MetaProperty.COLLECTION_STRING) {
				this.diagramController.addProperty(plist, meta_prop);
			}
			ele.properties.push(plist);
			prop = plist;
		}
		var prop_tab = null;
		if(meta_prop.data_type == MetaProperty.COLLECTION_STRING) {
			prop_tab = PropertyPanel.CollectionString(this, meta_prop, prop, ele, meta_ele)
		}else{
			if(meta_prop.widget == MetaProperty.INPUT_FIELD) {
				prop_tab = PropertyPanel.InputField(this, meta_prop, prop, ele)
			}else if(meta_prop.widget == MetaProperty.FIXED_LIST) {
				prop_tab = PropertyPanel.FixedList(this, meta_prop, prop, ele)
			}
		}
		prop_tab.index = i;
		property_tabs.add(prop_tab);
		if(meta_prop.id == meta_prop_id) {
			property_tabs.setActiveTab(prop_tab);
		}
	}
	if(meta_ele.decomposition != undefined) {
		property_tabs.add(PropertyPanel.Decomposition(this, meta_ele, ele));
	}
	Ext.getCmp('propertypanel').add(property_tabs);

}

/**
 * @param type:"png" or "jpg"
 */
SequenceEditor.prototype.getImage = function(type) {
	window.open(this.canvas.getCanvasImage(type))
}

SequenceEditor.prototype.draw_sequence_specific = function() {
	for(var i=0;i < this.diagram.relationships.length;i++) {
		var rel_id = this.diagram.relationships[i];
		var rel = g_model.relationships[rel_id];
		for(var j=0;j < this.diagram.relationships.length;j++) {
			var rel2_id = this.diagram.relationships[i];
			var rel2 = g_model.relationships[rel2_id];
			if(rel.src == rel2.dest && rel.dest == rel2.src) {
				
			}
		}
	}
	for(var i=0;i < this.diagram.objects.length;i++) {
		var obj_id = this.diagram.objects[i];
		var rels = [];
		for(var j=0;j < this.diagram.relationships.length;j++) {
			var rel = g_model.relationships[this.diagram.relationships[i]];
			if(rel.dest == obj_id) {
				rels.push(rel);
			}
		}
		rels.sort(function(a,b){
			return g_model.properties[a.properties[0].children[0]].value > g_model.properties[b.properties[0].children[0]].value;
			});
		for(var j=0;j < rels.length;j++) {
			rels[j]
		}
	}
}


SequenceEditor.prototype.draw_relationship = function(rel) {
	var col = '#000';
	if(rel == this.selected) {
		col = '#00f';
	}
	if(rel.ve.ver_type == 'delete') return;
	var src = ModelController.getObject(this.diagram, rel.src);
	var dest = ModelController.getObject(this.diagram, rel.dest);
	var s = new Point2D((src.bound.x + src.bound.width / 2), (src.bound.y + src.bound.height / 2));
	var e = new Point2D((dest.bound.x + dest.bound.width / 2), (dest.bound.y + dest.bound.height / 2));
	//TODO START
	var prop = null;
	for(var i=0;i < rel.properties.length;i++) {
		if(rel.properties[i].meta_id == 4) {
			prop = rel.properties[i];
		}
	}
	//TODO END
	s.y = Number(g_model.properties[prop.children[0]].value) + 200;
	e.y = s.y;
//	e.y += Number(g_model.properties[rel.properties[0].children[0]].value);
	var start = 0;
	var end = 0;
	start = this.getConnectionPoint(new Line2D(s.x, s.y, e.x, e.y), src.bound);
	end = this.getConnectionPoint(new Line2D(e.x, e.y, s.x, s.y), dest.bound);
	/*
	if(rel.points.length == 0) {
		start = this.getConnectionPoint(new Line2D(s.x, s.y, e.x, e.y), src.bound);
		end = this.getConnectionPoint(new Line2D(e.x, e.y, s.x, s.y), dest.bound);
	}else if(rel.points.length > 0) {
		start = this.getConnectionPoint(new Line2D(s.x, s.y, rel.points[0].x, rel.points[0].y), src.bound);
		end = this.getConnectionPoint(new Line2D(e.x, e.y, rel.points[rel.points.length-1].x, rel.points[rel.points.length-1].y), dest.bound);
	}
	*/
	var points = [];
	points.push(start);
//	points = points.concat(rel.points);
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
		ah.draw(this.canvas, points[points.length-2], points[points.length-1]);
	}else if(arrow_type == 'TRIANGLE'){
		var ah = new ArrowHead(ArrowHead.TRIANGLE);
		ah.draw(this.canvas, points[points.length-2], points[points.length-1]);
	}else if(arrow_type == 'BLACK_TRIANGLE'){
		var ah = new ArrowHead(ArrowHead.BLACK_TRIANGLE);
		ah.draw(this.canvas, points[points.length-2], points[points.length-1]);
	}else{
		
	}
	var prop_x = 0;
	var prop_y = 0;
	for(var i=0;i < points.length;i++) {
		prop_x += points[i].x;
		prop_y += points[i].y;
	}
	prop_x /= points.length;
	prop_y /= points.length;
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
				var disp_text = p.value;
				var meta_prop = g_metamodel.metaproperties[prop.meta_id];
				if(meta_prop.visible == false) continue;
				if(meta_prop.widget == MetaProperty.FIXED_LIST) {
					for(var index=0;index < meta_prop.exfield.length;index++) {
						if(p.value == meta_prop.exfield[index].value) {
							disp_text = meta_prop.exfield[index].disp;
						}
					}
				}
				this.canvas.drawText({
					  fillStyle: "#000",
					  x: prop_x, y: prop_y + h * 20 + 10,
					  text: disp_text,
					  align: "center",baseline: "middle",font: "16px 'ＭＳ ゴシック'"
					});
				h++;
			}
		}
	}
}

SequenceEditor.prototype.getConnectionPoint = function(d, bound) {
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
