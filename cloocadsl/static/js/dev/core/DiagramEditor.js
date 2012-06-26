/**
 * 
 * @param name 名前
 * @param key　唯一のキー
 */
function DiagramEditor(name, key, diagram) {
	this.name = name;
	this.key = key;
	this.diagram = diagram;
	this.diagramController = new DiagramController(this.diagram);
	this.tool = null;
	this.drag_start = new Point2D();
	this.drag_move_prev = new Point2D();
	this.drag_move = new Point2D();
	this.drag_end = new Point2D();
	this.selected = null;
	this.dragMode = 0;
	this.select_button = null;
	this.copied_elem = null;
	var self = this;
	this.diagramController.on('updateProperty', function(p, newValue, parent){
		if(parent.bound != undefined) calObjHeight(parent);
		self.draw();
	});
	
	this.width = 500;
	this.height = 500;
	for(var i=0;i < this.diagram.objects.length;i++) {
		var obj_id = this.diagram.objects[i];
		if(this.width < g_model.objects[obj_id].bound.x + g_model.objects[obj_id].bound.width + 50) {
			this.width = g_model.objects[obj_id].bound.x + g_model.objects[obj_id].bound.width + 50;
		}
		if(this.height < g_model.objects[obj_id].bound.y + g_model.objects[obj_id].bound.height + 50) {
			this.height = g_model.objects[obj_id].bound.y + g_model.objects[obj_id].bound.height + 50;
		}
	}
	console.log('width=' + this.width + ',height=' + this.height);
	this.panel = Ext.create('Ext.panel.Panel', {
			id: 'de_'+this.key,
			title: name,
			autoScroll: true,
			html : '<canvas id="canvas_'+this.key+'" width='+this.width+' height='+this.height+'></canvas>',
			closable: 'true'
		});
	this.canvas = $('#canvas_'+this.key);
}

DiagramEditor.prototype.changeCanvasSize = function(w, h) {
	/*
	this.width = w;
	this.height = h;
	this.panel = Ext.create('Ext.panel.Panel', {
		id: 'de_'+this.key,
		title: name,
		autoScroll: true,
		html : '<canvas id="canvas_'+this.key+'" width='+this.width+' height='+this.height+'></canvas>',
		closable: 'true'
	});
	*/
}

DiagramEditor.prototype.changeCanvasWidth = function(w) {
	this.width = Number(w);
	var a8 = document.getElementById('canvas_'+this.key);
	a8.width = this.width;
}

DiagramEditor.prototype.changeCanvasHeight = function(h) {
	this.height = Number(h);
	var a8 = document.getElementById('canvas_'+this.key);
	a8.width = this.height;
}

DiagramEditor.prototype.onUpdate = function() {
	this.diagram = g_model.diagrams[this.diagram.id];
	this.diagramController = new DiagramController(this.diagram);
}


DiagramEditor.prototype.draw = function() {
	var self = this;
	if(this.canvas == null || this.canvas == undefined) {
		this.canvas = $('#canvas_'+this.key);
	}
	self.canvas.drawRect({fillStyle: "#fff",x: 0, y: 0,width: self.width,height: self.height, fromCenter: false});
	var tmp_objs = [];
	for(var i=0;i < this.diagram.objects.length;i++) {
		var obj_id = this.diagram.objects[i];
		var obj = g_model.objects[obj_id];
		if(obj == undefined) alert(obj_id);
		tmp_objs.push(obj);
	}
	tmp_objs.sort(function(a,b) {return a.ofd.z-b.ofd.z;});
	for(var i=0;i < tmp_objs.length;i++) {
		var obj_id = tmp_objs[i].id;
		var obj = tmp_objs[i];
		this.draw_object(obj);
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
	if(self.dragMode == DiagramEditor.DRAG_RUBBERBAND) {
		self.canvas.drawLine({
			  strokeStyle: "#777",
			  strokeWidth: 2,
			  strokeCap: "round",
			  strokeJoin: "miter",
			  x1: self.drag_start.x, y1: self.drag_start.y,
			  x2: self.drag_move.x, y2: self.drag_move.y
			});
	}else if(self.dragMode == DiagramEditor.DRAG_RANGE) {
		self.canvas.drawRect({
			  strokeStyle: "#00f", strokeWidth: 2,
			  x: this.drag_start.x, y: this.drag_start.y,
			  width: this.drag_move.x - this.drag_start.x, height: this.drag_move.y - this.drag_start.y,
			  fromCenter: false
		});
	}
}

DiagramEditor.prototype.getPanel = function() {
	return this.panel;
}

DiagramEditor.prototype.Initialize = function() {
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
	        id: 'copy',
	        text: 'コピー'
	    },{
	        id: 'paste',
	        text: 'ペースト'
	    },{
	        id: 'up_step',
	        text: '一つ上へ'
	    },{
	        id: 'down_step',
	        text: '一つ下へ'
	    },{
	        id: 'diagram',
	        text: '関連する図を作成'
	    }],
	    listeners: {
        click: function(menu, item) {
            switch (item.id) {
                case 'delete_element':
                	self.deleteSelected();
                    break;
                case 'delete_point':
                	self.deletePoint();
                    break;
                case 'copy':
                	self.copyObject();
                    break;
                case 'paste':
                	self.pasteObject(self.drag_start.x, self.drag_start.y);
                    break;
                case 'up_step':
                	self.up_step();
                    break;
                case 'down_step':
                	self.down_step();
                    break;
                case 'diagram':
            		if(current_editor != null && current_editor.selected != null && g_metamodel.metaobjects[current_editor.selected.meta_id].decomposition != null && current_editor.selected.diagram == null) {
                     	var d = ModelController.addDiagram(g_metamodel.metaobjects[current_editor.selected.meta_id].decomposition);
            			current_editor.selected.diagram = d.id;
            			change_diagram_name_view(d);
            		}
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

DiagramEditor.prototype.onActivate = function() {
	this.createButton();
	current_editor = this;
}

/**
 * static変数
 */
DiagramEditor.DRAG_NONE = 0;
DiagramEditor.DRAG_RUBBERBAND = 1;
DiagramEditor.DRAG_MOVE = 2;
DiagramEditor.DRAG_POINT = 3;
DiagramEditor.DRAG_RANGE = 4;
DiagramEditor.DRAG_RESIZE = 5;
DiagramEditor.DRAG_RANGE = 6;

DiagramEditor.prototype.ActionMove = function(x, y) {
	this.drag_move.x = x;
	this.drag_move.y = y;
	if(this.dragMode == DiagramEditor.DRAG_MOVE) {
		if(this.selected != null) {
			if(this.selected instanceof Array) {
				for(var i=0;i < this.selected.length;i++){
					this.updateObject(this.selected[i],Number(this.drag_move.x-this.drag_move_prev.x),Number(this.drag_move.y-this.drag_move_prev.y));
				}
			}else{
				this.updateObject(this.selected,Number(this.drag_move.x-this.drag_move_prev.x),Number(this.drag_move.y-this.drag_move_prev.y));
			}
			this.draw()
		}
	}else if(this.dragMode == DiagramEditor.DRAG_RUBBERBAND) {
		this.draw()
	}else if(this.dragMode == DiagramEditor.DRAG_RESIZE) {
		if(this.selected instanceof Array) {
			
		}else{
			this.selected.bound.width = this.drag_move.x - this.selected.bound.x;
			this.selected.bound.height = this.drag_move.y - this.selected.bound.y;
			if(this.selected.bound.width < 16) this.selected.bound.width = 16;
			if(this.selected.bound.height < 16) this.selected.bound.height = 16;
		}
		this.draw();
	}else if(this.dragMode == DiagramEditor.DRAG_RANGE){
		this.draw();
	}else{
		
	}
	this.drag_move_prev.x = this.drag_move.x;
	this.drag_move_prev.y = this.drag_move.y;
}

DiagramEditor.prototype.updateObject = function(obj, x, y) {
	this.diagramController.updateObject(obj, x, y)
	if(this.width < obj.bound.x + obj.bound.width + 32) {
		this.changeCanvasWidth(obj.bound.x + obj.bound.width + 32);
	}
	if(this.height < obj.bound.y + obj.bound.height + 32) {
		this.changeCanvasHeight(obj.bound.y + obj.bound.height + 32);
	}
}

DiagramEditor.prototype.ActionDown = function(x, y) {
	if(this.tool == null) {
		if(this.clicknode(Number(x), Number(y))) {
			if(this.dragMode != DiagramEditor.DRAG_RESIZE) this.dragMode = DiagramEditor.DRAG_MOVE;
		}else if(this.clickedge(x, y)) {
//			this.dragMode = DiagramEditor.DRAG_POINT;
		}else{
			this.dragMode = DiagramEditor.DRAG_RANGE;
			this.selected = null;
		}
	}else if(this.tool.classname == 'MetaObject'){
		this.diagramController.addObject(x, y, this.tool.id);
		this.select_button.toggle(true, false);
	}else if(this.tool.classname == 'MetaRelation'){
		this.dragMode = DiagramEditor.DRAG_RUBBERBAND;
	}
	this.drag_start.x = x;
	this.drag_start.y = y;
}

DiagramEditor.prototype.ActionUp = function(x, y) {
	this.drag_end.x = x;
	this.drag_end.y = y;
	if(this.dragMode == DiagramEditor.DRAG_RUBBERBAND) {
		this.diagramController.addRelationship(this.drag_start, this.drag_end, this.tool.id);
		this.select_button.toggle(true);
	}else if(this.dragMode == DiagramEditor.DRAG_POINT) {
		if(this.selected instanceof Array == false) {
			this.movePoint(this.selected, this.drag_start, this.drag_end);
		}
	}else if(this.dragMode == DiagramEditor.DRAG_RANGE) {
		this.selectRange(this.drag_start, this.drag_end);
	}
	this.dragMode = DiagramEditor.DRAG_NONE;
}


DiagramEditor.prototype.copyObject = function() {
	if(this.selected instanceof Array) {
		this.copied_elem = [];
		for(var i=0;i < this.selected.length;i++) {
			var obj = this.selected[i]
			if(obj.ofd == undefined) {
				return;
			}
			this.copied_elem.push(obj);
		}
	}else{
		this.copied_elem = null;
		var obj = this.selected;
		if(obj.ofd == undefined) {
			return;
		}
		this.copied_elem = obj;
	}
}

DiagramEditor.prototype.pasteObject = function(x, y) {
	if(this.copied_elem != null && this.copied_elem instanceof Array == false) {
		var obj = this.diagramController.addObject(x, y, this.copied_elem.meta_id);
		for(var i=0;i < obj.properties.length;i++) {
			var src_plist = null;
			for(var j=0;j < this.copied_elem.properties.length;j++) {
				if(this.copied_elem.properties[j].meta_id == obj.properties[i].meta_id) {
					src_plist = this.copied_elem.properties[j];
					break;
				}
			}
			var dest_plist = obj.properties[i];
			while(dest_plist.children.length < src_plist.children.length) {
				this.diagramController.addProperty(dest_plist, g_metamodel.metaproperties[src_plist.meta_id], '');
			}
			for(var j=0;j < src_plist.children.length;j++) {
				this.diagramController.updateProperty(g_model.properties[dest_plist.children[j]], g_model.properties[src_plist.children[j]].value, obj);
			}
		}
	}
}

DiagramEditor.prototype.deletePoint = function() {
	if(this.selected instanceof Array) {
		
	}else{
		var rel = this.selected;
		if(rel == null) return;
		rel.points.length = 0;
	}
}

DiagramEditor.prototype.movePoint = function(rel, s, d) {
	if(rel != null) {
		var flg = true;
		for(var i=0;i < rel.points.length;i++) {
			if(Point2D.distanceSq(rel.points[i], s) < 150) {
				rel.points[i].x = d.x;
				rel.points[i].y = d.y;
				flg = false;
			}
		}
		if(flg) {
			if(rel.points.length < 2) {
				rel.points.push(new Point2D(d.x, d.y));
			}
		}
	}
}

DiagramEditor.prototype.selectRange = function(s, e) {
	var rect;
	var x, y, w, h;
	if(s.x > e.x) {
		x = e.x;
		w = s.x - e.x;
	}else{
		x = s.x;
		w = e.x - s.x;
	}
	if(s.y > e.y) {
		y = e.y;
		h = s.y - e.y;
	}else{
		y = s.y;
		h = e.y - s.y;
	}
	var rect = new Rectangle2D(x, y, w, h);
	this.selected = [];
	
	for(var i=0;i < this.diagram.objects.length;i++) {
		var obj_id = this.diagram.objects[i];
		var obj = g_model.objects[obj_id];
		if(obj == undefined) alert(obj_id);
		if(obj.ve.ver_type == 'delete') continue;
		if(Rectangle2D.contains(rect, new Point2D(obj.bound.x, obj.bound.y))) {
			if(Rectangle2D.contains(rect, new Point2D(obj.bound.x + obj.bound.width, obj.bound.y + obj.bound.height))) {
				this.selected.push(obj);
			}
		}
	}
	if(this.selected.length == 0) {
		this.selected = null;
	}
}

DiagramEditor.prototype.clicknode = function(x, y) {
	if(this.selected instanceof Array) {
		var obj = this.diagramController.findNode(new Point2D(x, y));
		if(obj != null) {
			for(var i=0;i < this.selected.length;i++) {
				if(obj.id == this.selected[i].id) {
					return true;
				}
			}
		}
		return false;
	}else{
		var obj = this.diagramController.findNode(new Point2D(x, y));
		if(obj != null) {
			var rel = null;
			if(this.clickedge(x, y)) {
				rel = this.selected;
				this.selected = null;
			}
			if(obj == this.selected) {
				if(Rectangle2D.contains(new Rectangle2D(obj.bound.x+obj.bound.width-12, obj.bound.y+obj.bound.height-12, 12, 12), new Point2D(x, y))) {
					this.dragMode = DiagramEditor.DRAG_RESIZE;
				}
			}
			if(obj.ve.ver_type == "delete") return false;
			if(rel != null) {
				if(obj.ofd.z < g_model.objects[rel.src].ofd.z && obj.ofd.z < g_model.objects[rel.dest].ofd.z) {
					return false;
				}
			} 
			this.selected = obj;
			this.fireSelectObject(this.selected);
			return true;
		}
		return false;
	}
}

DiagramEditor.prototype.clickedge = function(x, y) {
	for(var i=0;i < this.diagram.relationships.length;i++) {
		if(this.click_a_edge(g_model.relationships[this.diagram.relationships[i]], x, y)) return true;
	}
	return false;
}

DiagramEditor.prototype.click_a_edge = function(rel, x, y) {
	if(rel.ve.ver_type == "delete") return false;
	var points = new Array();
	var src = ModelController.getObject(this.diagram, rel.src);
	var dest = ModelController.getObject(this.diagram, rel.dest);
	var s = new Point2D((src.bound.x + src.bound.width / 2), (src.bound.y + src.bound.height / 2));
	var e = new Point2D((dest.bound.x + dest.bound.width / 2), (dest.bound.y + dest.bound.height / 2));
	points.push(s);
	points = points.concat(rel.points);
	points.push(e);
	for(var i=0;i < points.length - 1;i++) {
		if((new Line2D(points[i].x, points[i].y, points[i+1].x, points[i+1].y)).ptSegDist(x, y) < 16) {
			if(rel == this.selected) this.dragMode = DiagramEditor.DRAG_POINT;
			this.selected = rel;
			this.fireSelectRelationship(this.selected);
			return true;
		}
	}
	return false;
}



DiagramEditor.prototype.createButton = function() {
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
DiagramEditor.prototype.deleteSelected = function() {
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

DiagramEditor.prototype.info = function() {
	if(this.selected != null) {
		var str = 'ver_type='+this.selected.ve.ver_type;
		str += '<br>version='+this.selected.ve.version;
		str += '<br>id='+this.selected.id;
		str += '<br>pid='+Math.floor(this.selected.id / 10000);
		if(this.selected.ofd != undefined) str += '<br>z='+this.selected.ofd.z;
//		console.log(str);
//		Ext.MessageBox.alert(str);
		Ext.getCmp('element-infomation').removeAll();
		Ext.getCmp('element-infomation').add({
			html: str
		});
	}
}

DiagramEditor.prototype.most_up_step = function() {
	
}

DiagramEditor.prototype.most_down_step = function() {
	
}

DiagramEditor.prototype.up_step = function() {
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

DiagramEditor.prototype.down_step = function() {
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

DiagramEditor.prototype.fireSelectObject = function(selected) {
	var meta_obj = MetaModelController.getMetaObject(g_metamodel.metadiagram, selected.meta_id)
	this.createPropertyPanel(meta_obj, selected);
	this.info()
}

DiagramEditor.prototype.fireSelectRelationship = function(selected) {
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
DiagramEditor.prototype.createPropertyPanel = function(meta_ele, ele) {
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
DiagramEditor.prototype.getImage = function(type) {
	window.open(this.canvas.getCanvasImage(type))
}

function PropertyPanel(){}

PropertyPanel.Decomposition = function(dc, meta_ele, ele) {
	var data = [];
	for(var d in g_model.diagrams) {
		var prop = g_model.diagrams[d].properties[0];
		dname = g_model.properties[prop.children[0]].value;
		console.log(dname);
		data.push({id:g_model.diagrams[d].id, name:dname});
	}
	var states = Ext.create('Ext.data.Store', {
	    fields: ['id','name'],
	    data : data
	});
	var prop_tab = {
            title: 'diagram',
            html : '',
            items: [
                  {
	  	        	   xtype: 'combobox',
	  	        	   store: states,
	  	        	    queryMode: 'local',
	  	        	    displayField: 'name',
	  	        	    valueField: 'id',
  	        		   value: ele.diagram,
  	        		   listeners: {
  	        			   change: {
  	        				   fn: function(field, newValue, oldValue, opt) {
  	        					   ele.diagram = Number(newValue);
  	        				   }
  	        			   }
  	        		   }
                  }
                  ]
		};
	return prop_tab;
}
PropertyPanel.InputField = function(dc, meta_prop, prop, ele) {
	var p = g_model.properties[prop.children[0]];
	var field = 'textfield';
	if(meta_prop.data_type.toLowerCase() == MetaProperty.STRING) {
		field = 'textfield';
	}else if(meta_prop.data_type.toLowerCase() == MetaProperty.NUMBER){
		field = 'numberfield';
	}
	var prop_tab = {
            title: meta_prop.name,
            html : '',
            items: [{
	  	        	   xtype: field,
  	        		   value: p.value,
  	        		   listeners: {
  	        			   change: {
  	        				   fn: function(field, newValue, oldValue, opt) {
	        						dc.diagramController.updateProperty(p, newValue, ele);
  	        				   }
  	        			   }
  	        		   }
                  }]
		};
	return prop_tab;
}
PropertyPanel.FixedList = function(dc, meta_prop, prop, ele) {
	var p = g_model.properties[prop.children[0]];
	var states = Ext.create('Ext.data.Store', {
	    fields: ['disp','value'],
	    data : meta_prop.exfield
	});
	var prop_tab = {
            title: meta_prop.name,
            html : '',
            items: [
                  {
	  	        	   xtype: 'combobox',
	  	        	   store: states,
	  	        	    queryMode: 'local',
	  	        	    displayField: 'disp',
	  	        	    valueField: 'value',
  	        		   value: p.value,
  	        		   listeners: {
  	        			   change: {
  	        				   fn: function(field, newValue, oldValue, opt) {
 	        						g_model.properties[prop.children[0]].value = newValue;
 	        						dc.diagramController.updateProperty(p, newValue, ele);
  	        				   }
  	        			   }
  	        		   }
                  }
                  ]
		};
	return prop_tab;
}

PropertyPanel.selected = new Array();
/**
 * コレクション<String>用のプロパティエリア
 */
PropertyPanel.CollectionString = function(dc, meta_prop, prop, ele, meta_ele) {
	 var selModel = Ext.create('Ext.selection.CheckboxModel', {
	        listeners: {
	            selectionchange: function(sm, selections) {
	                grid4.down('#removeButton').setDisabled(selections.length == 0);
	                for(var i=0;i < selections.length;i++) {
	                	PropertyPanel.selected = new Array();
	                	PropertyPanel.selected.push(selections[i].get('index'));
//	                	console.log(i + '=' + selections[i].get('index'));
	                }
	            }
	        }
	    });
	    Ext.define('Collection', {
	        extend: 'Ext.data.Model',
	        fields: ['value']
	    });
	 var dummy = new Array();
	 for(var i=0;i < prop.children.length;i++) {
		var p = g_model.properties[prop.children[i]];
		if(p.ve.ver_type != 'delete') dummy.push({id: p.id, index: i, value : p.value});
	 }
	 var store = Ext.create('Ext.data.Store', {
         model: 'Collection',
         data: dummy
     });
	 //追加ボタンが押されたときの処理
	 var additem = function() {
		 Ext.Msg.prompt('追加','プロパティ',function(btn,text){
			 if(btn != 'cancel') {
				 dc.diagramController.addProperty(prop, meta_prop, text);
				 //アクティブにするタブを指定して、プロパティエリアを再構築
				 if(ele.bound != undefined) calObjHeight(ele);
				 current_editor.createPropertyPanel(meta_ele, ele, meta_prop.id);
			 }
		 },null,false,'');
	 }
	 //編集ボタンが押されたときの処理
	 var optionitem = function() {
		 var p = g_model.properties[prop.children[PropertyPanel.selected[0]]];
		 Ext.Msg.prompt('編集','プロパティ',function(btn,text){
			 if(btn != 'cancel') {
				 var p = g_model.properties[prop.children[PropertyPanel.selected[0]]];
				 dc.diagramController.updateProperty(p, text, ele);
			 }
		 },null,false,p.value);
	 }
	 //削除ボタンが押されたときの処理
	 var deleteitem = function() {
		 for(var i=0;i<PropertyPanel.selected.length;i++) {
			 //プロパティの削除
			 if(p.ve.ver_type == 'add') {
				 delete g_model.properties[prop.children[PropertyPanel.selected[i]]];
				 prop.children.splice(PropertyPanel.selected[i], 1);
			 }else{
				 g_model.properties[prop.children[PropertyPanel.selected[i]]].ve.ver_type = 'delete';
			 }
			 //アクティブにするタブを指定して、プロパティエリアを再構築
			 if(ele.bound != undefined) calObjHeight(ele);
			 current_editor.createPropertyPanel(meta_ele, ele, meta_prop.id);
		 }
	 }
	    var grid4 = Ext.create('Ext.grid.Panel', {
	        id:'property_collection_'+meta_prop.name,
	        store: store,
	        columns: [
	            {text: "string", flex: 1, sortable: true, dataIndex: 'value'},
	        ],
	        columnLines: true,
	        selModel: selModel,

	        // inline buttons
	        dockedItems: [{
	            xtype: 'toolbar',
	            dock: 'bottom',
	            ui: 'footer',
	            layout: {
	                pack: 'center'
	            },
	            items: []
	        }, {
	            xtype: 'toolbar',
	            items: [{
	                text:'追加',
	                tooltip:'Add a new row',
	                iconCls:'add',
	                handler : additem
	            }, '-', {
	                text:'編集',
	                tooltip:'Set options',
	                iconCls:'option',
	                handler : optionitem
	            },'-',{
	                itemId: 'removeButton',
	                text:'削除',
	                tooltip:'Remove the selected item',
	                iconCls:'remove',
	                disabled: true,
	                handler : deleteitem
	            }]
	        }],
	        
	        width: 500,
	        height: 160,
	        frame: true,
	        title: meta_prop.name,
	        iconCls: 'icon-grid'
	    });
	    return grid4;
}

function calObjHeight(obj) {
	if(obj.bound == undefined) return;
	if(g_metamodel.metaobjects[obj.meta_id].resizable == true) return;
	var h = 0;
	var w = 4;
	for(var j=0;j < obj.properties.length;j++) {
		var plist = obj.properties[j];
		for(var k=0;k < plist.children.length;k++) {
			h++;
			var prop = g_model.properties[plist.children[k]];
			if(prop.value != undefined && w < StrLen(prop.value)) w = StrLen(prop.value);
		}
	}
	obj.bound.height = h * 20 + 10;
	obj.bound.width = w * 8 + 16;
	if(obj.bound.height < 12) obj.bound.height = 42;
}

function draw_dot_line(canvas, col, p1, p2) {
	var len = Math.sqrt(Point2D.distanceSq(p1, p2));
	var dx = (p2.x - p1.x) / len;
	var dy = (p2.y - p1.y) / len;
	for(var i=0;i < len;i+=10) {
		var x = p1.x + dx * i;
		var y = p1.y + dy * i;
		var xx = p1.x + dx * (i + 5);
		var yy = p1.y + dy * (i + 5);
		canvas.drawLine({
			  strokeStyle: col,
			  strokeWidth: 2,
			  x1: x, y1: y,
			  x2: xx, y2: yy
			});
	}
}

DiagramEditor.prototype.draw_object = function(obj) {
	if(obj.ve.ver_type == 'delete') return;
	var col = '#000';
	var obj_is_selected = false;
	if(this.selected instanceof Array) {
		for(var l=0;l < this.selected.length;l++) {
			if(obj == this.selected[l]) {
				col = '#00f';
				obj_is_selected = true;
				break;
			}
		}
	}else{
		if(obj == this.selected) {
			col = '#00f';
			obj_is_selected = true;
		}
	}
	var meta_ele = g_metamodel.metaobjects[obj.meta_id];
	if(meta_ele.graphic == null || meta_ele.graphic == 'rect') {
		this.canvas.drawRect({
			  strokeStyle: col, strokeWidth: 2,
			  fillStyle: "#fff",
			  x: obj.bound.x, y: obj.bound.y,
			  width: obj.bound.width, height: obj.bound.height,
			  fromCenter: false
		});
	}else if(meta_ele.graphic == 'package') {
		this.canvas.drawRect({
			  strokeStyle: col, strokeWidth: 2,
			  fillStyle: "#fff",
			  x: obj.bound.x, y: obj.bound.y - 20,
			  width: obj.bound.width - 30, height: 20,
			  fromCenter: false
		});
		this.canvas.drawRect({
			  strokeStyle: col, strokeWidth: 2,
			  fillStyle: "#fff",
			  x: obj.bound.x, y: obj.bound.y,
			  width: obj.bound.width, height: obj.bound.height,
			  fromCenter: false
		});
	}else if(meta_ele.graphic == 'rounded') {
		this.canvas.drawRect({
			  strokeStyle: col, strokeWidth: 2,
			  x: obj.bound.x, y: obj.bound.y,
			  width: obj.bound.width, height: obj.bound.height,
			  fromCenter: false,
			  cornerRadius: 5
		});
	}else if(meta_ele.graphic == 'circle') {
		$("canvas").drawArc({
			  strokeStyle: '#000', strokeWidth: 2,
			  x: obj.bound.x + obj.bound.width / 2, y: obj.bound.y + obj.bound.width / 2,
			  radius: obj.bound.width / 2,
			  start: 0, end: 359,
			  fromCenter: true
			});
	}else if(meta_ele.graphic == 'fillcircle') {
		$("canvas").drawArc({
			  fillStyle: '#000', strokeWidth: 2,
			  x: obj.bound.x + obj.bound.width / 2, y: obj.bound.y + obj.bound.width / 2,
			  radius: obj.bound.width / 2,
			  start: 0, end: 359,
			  fromCenter: true
			});
	}else if(meta_ele.graphic == 'endcircle') {
		$("canvas").drawArc({
			  strokeStyle: col, strokeWidth: 2,
			  x: obj.bound.x + obj.bound.width / 2, y: obj.bound.y + obj.bound.width / 2,
			  radius: obj.bound.width / 2,
			  start: 0, end: 359,
			  fromCenter: true
			});
		$("canvas").drawArc({
			  fillStyle: "#000", strokeWidth: 2,
			  x: obj.bound.x + obj.bound.width / 2, y: obj.bound.y + obj.bound.width / 2,
			  radius: obj.bound.width / 2 - 5,
			  start: 0, end: 359,
			  fromCenter: true
			});
	}else{
		var graphic = g_metamodel['graphics'][meta_ele.graphic];
		graphic.option.col = '#000';
		graphic.option.strokeStyle = '#000';
		if(graphic.type == 'polygon') {
			this.canvas.translateCanvas({
				  x: obj.bound.x + obj.bound.width / 2, y: obj.bound.y + obj.bound.height / 2,
				})
			this.canvas.scaleCanvas({
				x:0, y:0,
				scaleX: obj.bound.width / 50, scaleY: obj.bound.height / 50
				})
			this.canvas.drawPolygon(graphic.option);
			this.canvas.restoreCanvas();
			this.canvas.restoreCanvas();
		}else if(graphic.type == 'lines') {
			this.canvas.translateCanvas({
				  x: obj.bound.x + obj.bound.width / 2, y: obj.bound.y + obj.bound.width / 2,
			});
			this.canvas.scaleCanvas({
				x:0, y:0,
				scaleX: obj.bound.width / 50, scaleY: obj.bound.height / 50
				});
			this.canvas.drawLine(graphic.option);
			this.canvas.restoreCanvas();
			this.canvas.restoreCanvas();
		}else if(graphic.type == 'src') {
			this.canvas.drawImage({
				  source: graphic.src,
				  x: obj.bound.x + obj.bound.width/2, y: obj.bound.y + obj.bound.height/2,
				  width: obj.bound.width, height:obj.bound.height
				});
		}
	}
	if(obj_is_selected) {
		this.canvas.drawRect({
			  strokeStyle: '#00f', strokeWidth: 2,
			  x: obj.bound.x, y: obj.bound.y,
			  width: obj.bound.width, height: obj.bound.height,
			  fromCenter: false
		});
		/*
		 * for resizable object
		 */
		if(meta_ele.resizable == true) {
			this.canvas.drawRect({
				  fillStyle: "#00f", strokeWidth: 2,
				  x: obj.bound.x+obj.bound.width-12, y: obj.bound.y+obj.bound.height-12,
				  width: 12, height: 12,
				  fromCenter: false
			});
		}
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
				this.canvas.drawText({
					  fillStyle: "#000",
					  x: obj.bound.x+obj.bound.width / 2, y: obj.bound.y + h * 20 + 20,
					  text: disp_text,
					  align: "center",
					  baseline: "middle",
					  font: "16px 'ＭＳ ゴシック'"
					});
				h++;
			}
			if(meta_ele.properties.length-1 != l && (meta_ele.graphic == 'rect' || meta_ele.graphic == 'rounded')) {
				this.canvas.drawLine({
					  strokeStyle: "#000",
					  strokeWidth: 2,
					  x1: obj.bound.x, y1: obj.bound.y + h * 20 + 10,
					  x2: obj.bound.x+obj.bound.width, y2: obj.bound.y + h * 20 + 10
					});
			}
		}
	}
}

DiagramEditor.prototype.draw_relationship = function(rel) {
	var meta_ele = g_metamodel.metarelations[rel.meta_id];
	var col = '#000';
	if(rel == this.selected) {
		col = '#00f';
	}
	if(rel.ve.ver_type == 'delete') return;
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
		if(meta_ele.dot) {
			draw_dot_line(this.canvas, col, points[i], points[i+1]);
		}else{
			this.canvas.drawLine({
				  strokeStyle: col,
				  strokeWidth: 2,
				  strokeCap: "round",
				  strokeJoin: "miter",
				  x1: points[i].x, y1: points[i].y,
				  x2: points[i+1].x, y2: points[i+1].y
				});
		}
	}
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
				if(meta_prop.widget == MetaProperty.FIXED_LIST) {
					for(var index=0;index < meta_prop.exfield.length;index++) {
						if(p.value == meta_prop.exfield[index].value) {
							disp_text = meta_prop.exfield[index].disp;
						}
					}
				}
				var px = prop_x;
				var py = prop_y + h * 20 + 10;
				if(meta_prop.position == 'src') {
					px = (start.x*5 + end.x) / 6;
					py = (start.y*5 + end.y) / 6 + 10;
				}else if(meta_prop.position == 'dest') {
					px = (start.x + end.x*5) / 6;
					py = (start.y + end.y*5) / 6 + 10;
				}else{
					px = prop_x;
					py = prop_y + h * 20 + 10;
				}
				this.canvas.drawText({
					  fillStyle: "#000",
					  x: px, y: py,
					  text: disp_text,
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
