/**
 * 
 * @param key
 * @param name
 * @param diagram:ダイアグラム(モデル要素への参照集合)
 * @param modelController：モデル要素へのインターフェイス
 * @returns
 */
function GraphiticalMetaModelEditor(key, name, pkg, metaModelController, wb) {
	var self = this;
	this.name = name;
	this.key = key;
	this.pkg = pkg;
	if(this.pkg.content.gmme == undefined) {
		this.pkg.content.gmme = {};
	}
	this.metaModelController = metaModelController;
	this.wb = wb;
	this.tool = null;
	this.drag_start = new Point2D();
	this.drag_move_prev = new Point2D();
	this.drag_move = new Point2D();
	this.drag_end = new Point2D();
	this.selected = null;
	this.dragMode = 0;
	this.select_button = null;
	this.copied_elem = null;
	this.width = 500;
	this.height = 500;
	/*
	for(var i=0;i < this.diagram.objects.length;i++) {
		var obj_id = this.diagram.objects[i];
		if(this.width < g_model.objects[obj_id].bound.x + g_model.objects[obj_id].bound.width + 50) {
			this.width = g_model.objects[obj_id].bound.x + g_model.objects[obj_id].bound.width + 50;
		}
		if(this.height < g_model.objects[obj_id].bound.y + g_model.objects[obj_id].bound.height + 50) {
			this.height = g_model.objects[obj_id].bound.y + g_model.objects[obj_id].bound.height + 50;
		}
	}
	*/
	console.log('width=' + this.width + ',height=' + this.height);
	this.panel = Ext.create('Ext.panel.Panel', {
			id: 'drag-source-' + this.key,
			title: name,
			autoScroll: true,
			html : '<canvas id="gmme-'+this.key+'" width='+this.width+' height='+this.height+'></canvas>',
			closable: true,
		     viewConfig: {
		         emptyText: '',
		         plugins: {
		            ptype: 'treeviewdragdrop',
		            ddGroup: 'fff',
		            allowContainerDrop: true,
		            appendOnly: true
		         },
		         listeners: {
		            drop: function (node, data, model, dropPosition, opts) {
		                       console.log(node);
		                  }
		         }
		     } 		});
	this.canvas = null;
	this.tool_palet = null;
}

GraphiticalMetaModelEditor.prototype.getPanel = function() {
	return this.panel;
}

GraphiticalMetaModelEditor.prototype.Initialize = function() {
	var self = this;
	this.canvas = $('#gmme-'+this.key);
	var mnuContext = this.getMenuContext();
	
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

GraphiticalMetaModelEditor.prototype.onActivate = function() {
	this.createButton();
	this.canvas = $('#gmme-'+this.key);
	this.draw();
}

GraphiticalMetaModelEditor.prototype.onDeactivate = function() {
	this.tool_palet.hide();
	this.tool_palet = null;
}

GraphiticalMetaModelEditor.prototype.save = function() {
	this.metaModelController.save();
}


/**
 * static変数
 */
GraphiticalMetaModelEditor.DRAG_NONE = 0;
GraphiticalMetaModelEditor.DRAG_RUBBERBAND = 1;
GraphiticalMetaModelEditor.DRAG_MOVE = 2;
GraphiticalMetaModelEditor.DRAG_POINT = 3;
GraphiticalMetaModelEditor.DRAG_RANGE = 4;
GraphiticalMetaModelEditor.DRAG_RESIZE = 5;
GraphiticalMetaModelEditor.DRAG_RANGE = 6;

GraphiticalMetaModelEditor.prototype.ActionMove = function(x, y) {
	this.drag_move.x = x;
	this.drag_move.y = y;
	if(this.dragMode == GraphiticalMetaModelEditor.DRAG_MOVE) {
		if(this.selected != null) {
			if(this.selected instanceof Array) {
				for(var i=0;i < this.selected.length;i++){
					this.updateObject(this.selected[i],Number(this.drag_move.x-this.drag_move_prev.x),Number(this.drag_move.y-this.drag_move_prev.y));
				}
			}else{
				this.pkg.content.gmme[this.selected.name].x += this.drag_move.x-this.drag_move_prev.x;
				this.pkg.content.gmme[this.selected.name].y += this.drag_move.y-this.drag_move_prev.y;
			}
			this.draw()
		}
	}else if(this.dragMode == GraphiticalMetaModelEditor.DRAG_RUBBERBAND) {
		this.draw()
	}else if(this.dragMode == GraphiticalMetaModelEditor.DRAG_RESIZE) {
		if(this.selected instanceof Array) {
			
		}else{
			this.selected.bound.width = this.drag_move.x - this.selected.bound.x;
			this.selected.bound.height = this.drag_move.y - this.selected.bound.y;
			if(this.selected.bound.width < 16) this.selected.bound.width = 16;
			if(this.selected.bound.height < 16) this.selected.bound.height = 16;
		}
		this.draw();
	}else if(this.dragMode == GraphiticalMetaModelEditor.DRAG_RANGE){
		this.draw();
	}else{
		
	}
	this.drag_move_prev.x = this.drag_move.x;
	this.drag_move_prev.y = this.drag_move.y;
}

GraphiticalMetaModelEditor.prototype.ActionDown = function(x, y) {
	if(this.tool == null) {
		this.dragMode = GraphiticalMetaModelEditor.DRAG_MOVE;
		this.selected = this.findNode(x, y);
		if(this.selected) this.createPropertyArea();
		/*
		if(this.clicknode(Number(x), Number(y))) {
			if(this.dragMode != GraphiticalMetaModelEditor.DRAG_RESIZE) this.dragMode = GraphiticalMetaModelEditor.DRAG_MOVE;
		}else if(this.clickedge(x, y)) {
//			this.dragMode = GraphiticalMetaModelEditor.DRAG_POINT;
		}else{
			this.dragMode = GraphiticalMetaModelEditor.DRAG_RANGE;
			this.selected = null;
		}
		*/
	}else if(this.tool == 'Package'){
		var added = this.metaModelController.addPackage(this.pkg.parent_uri + '.' + this.pkg.name, 'unNamedPackage', 'dsml');
		this.pkg.content.gmme[added.name] = {};
		this.pkg.content.gmme[added.name].x = x;
		this.pkg.content.gmme[added.name].y = y;
//		this.select_button.toggle(true, false);
	}else if(this.tool == 'Class'){
		var added = this.metaModelController.addClass(this.pkg.parent_uri + '.' + this.pkg.name, 'unNamedClass');
		this.pkg.content.gmme[added.name] = {};
		this.pkg.content.gmme[added.name].x = x;
		this.pkg.content.gmme[added.name].y = y;
		this.pkg.content.gmme[added.name].w = 80;
		this.pkg.content.gmme[added.name].h = 50;
//		this.select_button.toggle(true, false);
	}else if(this.tool == 'Association'){
		this.dragMode = GraphiticalMetaModelEditor.DRAG_RUBBERBAND;
	}else if(this.tool.classname == 'MetaRelation'){
		this.dragMode = GraphiticalMetaModelEditor.DRAG_RUBBERBAND;
	}
	this.drag_start.x = x;
	this.drag_start.y = y;
}

GraphiticalMetaModelEditor.prototype.ActionUp = function(x, y) {
	this.drag_end.x = x;
	this.drag_end.y = y;
	if(this.dragMode == GraphiticalMetaModelEditor.DRAG_RUBBERBAND) {
		var src = this.findNode(this.drag_start.x,this.drag_start.y);
		var dest = this.findNode(this.drag_end.x,this.drag_end.y);
		this.addAssociation(src, dest);
//		this.select_button.toggle(true);
	}else if(this.dragMode == GraphiticalMetaModelEditor.DRAG_POINT) {
		if(this.selected instanceof Array == false) {
			this.movePoint(this.selected, this.drag_start, this.drag_end);
		}
	}else if(this.dragMode == GraphiticalMetaModelEditor.DRAG_RANGE) {
		this.selectRange(this.drag_start, this.drag_end);
	}else{
		if(this.dragMode == GraphiticalMetaModelEditor.DRAG_NONE) {
			var added = this.wb.metaPackageExplorer.selected_item;
			this.pkg.content.gmme[added.name] = {};
			this.pkg.content.gmme[added.name].x = x;
			this.pkg.content.gmme[added.name].y = y;
			this.pkg.content.gmme[added.name].w = 80;
			this.pkg.content.gmme[added.name].h = 50;
		}
	}
	this.dragMode = GraphiticalMetaModelEditor.DRAG_NONE;
}

GraphiticalMetaModelEditor.prototype.findNode = function(x, y) {
	for(var key in this.pkg.nestingPackages) {
		if(!this.pkg.content.gmme.hasOwnProperty(key)) continue;
		var pkg_x = this.pkg.content.gmme[key].x;
		var pkg_y = this.pkg.content.gmme[key].y;
		var pkg_w = this.pkg.content.gmme[key].w;
		var pkg_h = this.pkg.content.gmme[key].h;
		if(pkg_x < x && x < pkg_x +pkg_w) {
			if(pkg_y < y && y < pkg_y + pkg_h) {
				return this.pkg.nestingPackages[key];
			}
		}
	}
	for(var key in this.pkg.content.classes) {
		if(!this.pkg.content.gmme.hasOwnProperty(key)) continue;
		var pkg_x = this.pkg.content.gmme[key].x;
		var pkg_y = this.pkg.content.gmme[key].y;
		var pkg_w = this.pkg.content.gmme[key].w;
		var pkg_h = this.pkg.content.gmme[key].h;
		if(pkg_x < x && x < pkg_x +pkg_w) {
			if(pkg_y < y && y < pkg_y + pkg_h) {
				return this.pkg.content.classes[key];
			}
		}
	}
	return null;
}

GraphiticalMetaModelEditor.prototype.addAssociation = function(src, dest) {
	var asso = this.metaModelController.addAssociation(src.parent_uri + '.' + src.name, 'UnNamedAssociation');
	asso.etype = dest.parent_uri + '.' + dest.name;
}

GraphiticalMetaModelEditor.prototype.draw = function() {
	this.canvas.drawRect({fillStyle: "#fff",x: 0, y: 0,width: this.width,height: this.height, fromCenter: false});
	for(var key in this.pkg.nestingPackages) {
		if(!this.pkg.content.gmme.hasOwnProperty(key)) continue;
		var col = "#000";
		if(this.selected == this.pkg.nestingPackages[key]) {
			col = "#00F";
		}
		var x = this.pkg.content.gmme[key].x;
		var y = this.pkg.content.gmme[key].y;
		var w = this.pkg.content.gmme[key].w;
		var h = this.pkg.content.gmme[key].h;
		this.canvas.drawRect({
			strokeStyle: col,
			fillStyle: '#fff',
			x: x, y: y,
			width: w, height: h,
			fromCenter: false}
		);
		this.canvas.drawText({
			  fillStyle: "#000",
			  x: x, y: y,
			  text: this.pkg.nestingPackages[key].name,
			  align: "center",
			  baseline: "middle",
			  font: "16px 'ＭＳ ゴシック'"
			});
	}
	for(var key in this.pkg.content.classes) {
		if(!this.pkg.content.gmme.hasOwnProperty(key)) continue;
		var col = "#000";
		if(this.selected == this.pkg.content.classes[key]) {
			col = "#00F";
		}
		var x = this.pkg.content.gmme[key].x;
		var y = this.pkg.content.gmme[key].y;
		var w = this.pkg.content.gmme[key].w;
		var h = this.pkg.content.gmme[key].h;
		this.canvas.drawRect({
			strokeStyle: col,
			fillStyle: '#fff',
			x: x, y: y,
			width: w, height: h,
			fromCenter: false}
		);
		this.canvas.drawText({
			  fillStyle: "#000",
			  x: x, y: y + 20,
			  text: this.pkg.content.classes[key].name,
			  align: "center",
			  baseline: "middle",
			  font: "16px 'ＭＳ ゴシック'"
			});
		for(var akey in this.pkg.content.classes[key].associations) {
			var asso = this.pkg.content.classes[key].associations[akey];
			var targetName = asso.etype.split('.').pop();
			var target_x = this.pkg.content.gmme[targetName].x;
			var target_y = this.pkg.content.gmme[targetName].y;
			this.canvas.drawLine({
				  strokeStyle: "#777",
				  strokeWidth: 2,
				  strokeCap: "round",
				  strokeJoin: "miter",
				  x1: x, y1: y,
				  x2: target_x, y2: target_y
				});
		}
	}
	if(this.dragMode == DiagramEditor.DRAG_RUBBERBAND) {
		this.canvas.drawLine({
			  strokeStyle: "#777",
			  strokeWidth: 2,
			  strokeCap: "round",
			  strokeJoin: "miter",
			  x1: this.drag_start.x, y1: this.drag_start.y,
			  x2: this.drag_move.x, y2: this.drag_move.y
			});
	}
}

GraphiticalMetaModelEditor.prototype.createPropertyArea = function() {
	var self = this;
	var props = [];
	props[0] = {
        	name: 'name',
        	xtype: 'textfield',
        	fieldLabel: 'name',
        	value: this.selected.name,
        	listeners : {
        		change : {
        			fn : function(textField, newValue) {
        				self.metaModelController.rename(self.selected.parent_uri + '.' + self.selected.name, newValue);
        			}
        		}
        	}
		};
	if(this.selected.meta == 'C') {
	}else{
	}
	this.wb.statuspanel.setPropertyPanel(props);
}

GraphiticalMetaModelEditor.prototype.createButton = function() {
	var self = this;
	if(this.tool_palet == undefined || this.tool_palet == null) {
		items = [];
		function basetool(t) {t.xtype = 'button';t.enableToggle = true;t.toggleGroup = 'tools';return t;}
		items.push(basetool({text : 'SELECT',handler :function(btn){self.tool = null;}}));
		items.push(basetool({text : 'Package',handler :function(btn){self.tool = 'Package';}}));
		items.push(basetool({text : 'Class',handler :function(btn){self.tool = 'Class';}}));
		items.push(basetool({text : 'Association',handler :function(btn){self.tool = 'Association';}}));
		items.push(basetool({text : 'Property',handler :function(btn){self.tool = 'Property';}}));
		this.tool_palet = Ext.create('Ext.window.Window', {
		    title: 'ツールパレット',
		    height: 240,
		    width: 80,
		    layout: 'vbox',
		    closable: false,
		    items: items
		});
	}
	this.tool_palet.showAt(720,120);
}

GraphiticalMetaModelEditor.prototype.deleteFromDiagram = function() {
	delete this.pkg.content.gmme[this.selected.name];
}

GraphiticalMetaModelEditor.prototype.deleteFromModel = function() {
	this.metaModelController.del(this.selected.parent_uri + '.' + this.selected.name);
}

/*
 * private
 */
GraphiticalMetaModelEditor.prototype.getMenuContext = function() {
	var self = this;
	return new Ext.menu.Menu({
	    items: [{
	        id: 'delete-from-diagram',
	        text: '図から削除'
	    },{
	        id: 'delete-from-model',
	        text: 'モデルから削除'
	    },{
	        id: 'delete-point',
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
                case 'delete-from-diagram':
                	self.deleteFromDiagram();
                    break;
                case 'delete-from-model':
                	self.deleteFromModel();
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
            		if(self.wb.editorTabPanel.current_editor != null && self.wb.editorTabPanel.current_editor.selected != null && g_metamodel.metaobjects[current_editor.selected.meta_id].decomposition != null && current_editor.selected.diagram == null) {
                     	var d = ModelController.addDiagram(g_metamodel.metaobjects[self.wb.editorTabPanel.current_editor.selected.meta_id].decomposition);
                     	self.wb.editorTabPanel.current_editor.selected.diagram = d.id;
            			change_diagram_name_view(d);
            		}
                    break;
            }
        }
	    }
	});
}
