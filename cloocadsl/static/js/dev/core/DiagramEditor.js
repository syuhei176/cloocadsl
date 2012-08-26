/**
 * 
 * @param key
 * @param name
 * @param diagram:ダイアグラム(モデル要素への参照集合)
 * @param modelController：モデル要素へのインターフェイス
 * @param notationController : ノーテーションへのインターフェイス
 * @param toolController : ツール定義へのインターフェイス
 * @returns
 */
function DiagramEditor(key, name, diagram, modelController, ctool, wb) {
	console.log(this);
	var self = this;
	this.name = name;
	this.key = key;
	this.diagram = diagram;
	//ダイアグラム情報
	if(!this.diagram.hasOwnProperty('_sys_d')) {
		this.diagram._sys_d = {};
	}
	this.modelController = modelController;
	this.wb = wb;
	this.ctool = ctool;
	this.metaDiagram = this.ctool.getClass(this.diagram._sys_meta);
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
			title: name,
			autoScroll: true,
			html : '<canvas id="canvas-'+this.key+'" width='+this.width+' height='+this.height+'></canvas>',
			closable: true
		});
	this.canvas = null;
	this.tool_palet = null;
}

DiagramEditor.prototype.getPanel = function() {
	return this.panel;
}

DiagramEditor.prototype.Initialize = function() {
	var self = this;
	this.canvas = $('#canvas-'+this.key);
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

DiagramEditor.prototype.onActivate = function() {
	this.createButton();
}

DiagramEditor.prototype.onDeactivate = function() {
	this.tool_palet.hide();
	this.tool_palet = null;
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
				this.selected.x += this.drag_move.x-this.drag_move_prev.x;
				this.selected.y += this.drag_move.y-this.drag_move_prev.y;
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

/**
 * 
 */
DiagramEditor.prototype.addNodePattern1 = function(x, y, meta_ele) {
	//Structureの設定
	var asso = this.metaDiagram.getContainAssociation(meta_ele);
	if(asso && asso.feature == 'contain') {
		console.log(this.diagram._sys_uri);
		var instance = this.modelController.addInstance(this.diagram, meta_ele);
		this.diagram._sys_d[instance._sys_uri] = {
				uri : instance._sys_uri,
				x : x,
				y : y,
				w : 80,
				h : 50,
				child : {}
		};
		console.log('(' + x + ',' + y + ')に「'+meta_ele.name+'」ノードを追加');
		return;
	}
}

DiagramEditor.prototype.addNodePattern2 = function(x, y, meta_ele, parent, parent_sys_d) {
	//Structureの設定
	var metaParent = this.ctool.getClass(parent._sys_meta);
	var asso = metaParent.getContainAssociation(meta_ele);
	if(asso && asso.feature == 'child') {
		var instance = this.modelController.addInstance(parent, meta_ele);
		parent_sys_d.child[instance._sys_uri] = {
				uri : instance._sys_uri,
				x : x - parent_sys_d.x,
				y : y - parent_sys_d.y,
				w : 60,
				h : 40,
				child : {}
		};
		parent_sys_d.w = x + 70 - parent_sys_d.x;
		parent_sys_d.h = y + 50 - parent_sys_d.y;
		console.log('(' + x + ',' + y + ')に「'+meta_ele.name+'」ノードを追加');
		return;
	}
}

DiagramEditor.prototype.addConnection = function(src, dest, meta_ele) {
	console.log('(' + src + ',' + dest + ')に「'+meta_ele.name+'」コネクションを追加');
	//Structureの設定
	var srcMeta = this.ctool.getClass(src._sys_meta);
	var destMeta = this.ctool.getClass(dest._sys_meta);
	var instance = null;
	/*
	 * contain
	 */
	var casso = this.srcMeta.getContainAssociation(meta_ele);
	if(casso && casso.feature == 'contain') {
		//pattern 1
		instance = this.modelController.add(src._sys_uri, meta_ele);
	}else{
		casso = this.metaDiagram.getContainAssociation(meta_ele);
		if(casso && casso.feature == 'contain') {
			//pattern 2
			instance = this.modelController.addInstance(this.diagram, meta_ele);
		}else{
			//no pattern
			return;
		}
	}
	
	/*
	 * src
	 */
	var srcAsso = meta_ele.getAssociations(srcMeta);
	for(var i=0;i < srcAsso.length;i++) {
		if(srcAsso[i].feature == 'source') {
			this.modelController.addRelationship(src, instance, srcAsso[i]);
		}
	}
	
	/*
	 * dest
	 */
	var destAsso = meta_ele.getAssociations(destMeta);
	for(var i=0;i < destAsso.length;i++) {
		if(destAsso[i].feature == 'target') {
			this.modelController.addRelationship(dest, instance, destAsso[i]);
		}
	}
	
	this.diagram._sys_d[instance._sys_uri] = {
			uri : instance._sys_uri,
			gtype : 'connection',
			points : []
	};
}

DiagramEditor.prototype.ActionDown = function(x, y) {
	console.log(this);
	if(this.tool == null) {
		this.dragMode = DiagramEditor.DRAG_MOVE;
		this.selected = this.find(x, y);
		this.createPropertyArea();
	}else{
		var metaClass = this.ctool.getClass(this.tool.id);
		var parent_sys_d = this.find(x, y);
		if(parent_sys_d) {
			var parent = this.modelController.get(parent_sys_d.uri);
			if(metaClass.gtype == 'node') {
				//子ノード追加
				this.addNodePattern2(x, y, metaClass, parent, parent_sys_d);
			}else if(metaClass.gtype == 'connection') {
				//コネクションの追加
				this.dragMode = DiagramEditor.DRAG_RUBBERBAND;
			}
		}else{
			if(metaClass.gtype == 'node') {
				//ノード追加
				this.addNodePattern1(x, y, metaClass);
			}else if(metaClass.gtype == 'connection') {
				//コネクションの追加
				this.dragMode = DiagramEditor.DRAG_RUBBERBAND;
			}
		}
		console.log(this.modelController.getModel());
	}
	this.drag_start.x = x;
	this.drag_start.y = y;
	this.draw();
}

DiagramEditor.prototype.ActionUp = function(x, y) {
	this.drag_end.x = x;
	this.drag_end.y = y;
	if(this.dragMode == DiagramEditor.DRAG_RUBBERBAND) {
		var src = this.modelController.get(this.find(this.drag_start.x, this.drag_start.y).uri);
		var target = this.modelController.get(this.find(this.drag_end.x, this.drag_end.y).uri);
		var meta_ele = this.ctool.getClass(this.too.id);
		this.addConnection(src, target, meta_ele);
		/*
		this.select_button.toggle(true);
		*/
	}else if(this.dragMode == DiagramEditor.DRAG_POINT) {
		if(this.selected instanceof Array == false) {
			this.movePoint(this.selected, this.drag_start, this.drag_end);
		}
	}else if(this.dragMode == DiagramEditor.DRAG_RANGE) {
		this.selectRange(this.drag_start, this.drag_end);
	}
	this.dragMode = DiagramEditor.DRAG_NONE;
}

DiagramEditor.prototype.find = function(x, y) {
	var self = this;
	return findNode();
	function findNode() {
		for(var key in self.diagram._sys_d) {
			var node = self.diagram._sys_d[key];
			if(node.x < x && x < node.x + node.w) {
				if(node.y < y && y < node.y + node.h) {
					var result = findChild(node);
					if(result) return result;
					return node;
				}
			}
		}
		return null;
		function findChild(node) {
			for(var ckey in node.child) {
				var child = node.child[ckey];
				if(node.x + child.x < x && x < node.x + child.x + child.w) {
					if(node.y + child.y < y && y < node.y + child.y + child.h) {
						var result = findChild(child);
						if(result) return result;
						return child;
					}
				}
			}
			return null;
		}
	}
	function findConnection() {
		
	}
	function findProperty() {
		
	}
	return null;
}

DiagramEditor.prototype.draw = function() {
	var self = this;
	this.canvas.drawRect({fillStyle: "#fff",x: 0, y: 0,width: this.width,height: this.height, fromCenter: false});
	for(var key in this.diagram._sys_d) {
		var elem = this.modelController.get(key);
		var metaClass = this.ctool.getClass(elem._sys_meta);
		//containment feature
		//diagram infomation
		if(metaClass.shape == 'rect') {
			var col = "#000";
			if(this.selected && key == this.selected.id) {
				col = "#00f";
			}
			this.canvas.drawRect({
				strokeStyle: col,
				fillStyle: "#fff",
				x: this.diagram._sys_d[key].x, y: this.diagram._sys_d[key].y,
				width: this.diagram._sys_d[key].w, height: this.diagram._sys_d[key].h,
				fromCenter: false}
			);
			drawChild(this.diagram._sys_d[key]);
			/*
			for(var i=0;i < notation.labels.length;i++) {
				var prop = this.modelController.get(this.base_uri + '.' + key).props[notation.labels[i]];
				if(prop instanceof Array) {
					
				}else{
					this.canvas.drawText({
						  fillStyle: "#000",
						  x: this.arino.nodes[key].x, y: this.arino.nodes[key].y,
						  text: prop,
						  align: "center",
						  baseline: "middle",
						  font: "16px 'ＭＳ ゴシック'"
						});
				}
			}
			*/
		}
	}
	/*
	for(var key in this.arino.connections) {
		var notation = this.notationController.get(this.arino.connections[key].meta_uri);
		var elem = this.modelController.get(this.base_uri + '.' + key);
		var src_id = elem.a_props[notation.sourceFeature.split('.').pop()];
		var target_id = elem.a_props[notation.targetFeature.split('.').pop()];
		console.log(notation.sourceFeature.split('.').pop());
		this.canvas.drawLine({
			  strokeStyle: "#777",
			  strokeWidth: 2,
			  strokeCap: "round",
			  strokeJoin: "miter",
			  x1: this.arino.nodes[src_id].x, y1: this.arino.nodes[src_id].y,
			  x2: this.arino.nodes[target_id].x, y2: this.arino.nodes[target_id].y
			});
	}
	*/
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
	function drawChild(node) {
		for(var ckey in node.child) {
			var child = node.child[ckey];
			self.canvas.drawRect({
				strokeStyle: col,
				fillStyle: "#fff",
				x: node.x + child.x, y: node.y + child.y,
				width: child.w, height: child.h,
				fromCenter: false}
			);
			drawChild(child);
		}
	}
}

DiagramEditor.prototype.createPropertyArea = function() {
	if(this.selected == null) return;
	var self = this;
	var props = [];
	var metaElem = this.metaDataController.get(this.selected.meta_uri);
	for(var key in metaElem.properties) {
		props.push({
	        	name: key,
	        	xtype: 'textfield',
	        	fieldLabel: key,
	        	value: this.selected.props[key],
	        	listeners : {
	        		change : {
	        			fn : function(textField, newValue) {
	        				console.log(textField.name);
	        				self.modelController.get(self.base_uri + '.' + self.selected.id).props[key] = newValue;
	        			}
	        		}
	        	}
			});
	}
	this.wb.statuspanel.setPropertyPanel(props);
}

DiagramEditor.prototype.createButton = function() {
	var self = this;
	if(this.tool_palet == undefined || this.tool_palet == null) {
		items = [];
		items.push({
	    	xtype : 'button',
	    	text : 'SELECT',
		    enableToggle: true,
		    toggleGroup: 'tools',
	    	handler :function(btn){
	    		self.tool = null;
	    	}
		});
		var tools = this.metaDiagram.toolpalet;
		for(var i=0;i < tools.length;i++) {
			var item = {
			    	xtype : 'button',
			    	text : tools[i].name,
				    enableToggle: true,
				    toggleGroup: 'tools',
			    	key : i,
			    	handler :function(btn){
			    		console.log('test '+btn.key);
			    		self.tool = self.metaDiagram.toolpalet[btn.key];
			    	}
			};
			items.push(item);
		}
		this.tool_palet = Ext.create('Ext.window.Window', {
		    title: 'ツールパレット',
		    height: 320,
		    width: 100,
		    layout: 'vbox',
		    closable: false,
		    items: items
		});
	}
	this.tool_palet.show();
}



/*
 * private
 */
DiagramEditor.prototype.deleteSelected = function() {
	if(this.selected) {
		//図から削除
		delete this.arino.nodes[this.selected.id];
		//モデルから削除
		this.modelController.delClass(this.base_uri + '.' + this.selected.id);
		//選択解除
		this.selected = null;
		return true;
	}
	return false;
}

DiagramEditor.prototype.getMenuContext = function() {
	var self = this;
	return new Ext.menu.Menu({
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
