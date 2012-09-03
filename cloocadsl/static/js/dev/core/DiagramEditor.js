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
	this.selected = new DiagramEditor.SelectedObject();
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

DiagramEditor.prototype.onClose = function() {
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
	var self = this;
	this.drag_move.x = x;
	this.drag_move.y = y;
	if(this.dragMode == DiagramEditor.DRAG_MOVE) {
		if(this.selected.isSelected()) {
			if(this.selected.getSelectedType() == 'multi') {
				for(var key in this.selected.getSelectedDatas()){
					move_node(this.selected.getSelectedDatas()[key]);
				}
			}else if(this.selected.getSelectedType() == 'single') {
				move_node(this.selected.getSelectedData());
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
	
	/*
	 * private function
	 */
	function move_node(node) {
		if(node.x) {
			node.x += self.drag_move.x-self.drag_move_prev.x;
			node.y += self.drag_move.y-self.drag_move_prev.y;
			for(var key in node.child) {
				move_node(node.child[key]);
			}
		}
	}
}

/**
 * 
 */
DiagramEditor.prototype.addNodePattern1 = function(x, y, meta_ele) {
	//Structureの設定
	var asso = this.metaDiagram.getContainAssociation(meta_ele);
	if(asso && asso.feature === 'contain') {
		console.log(this.diagram._sys_uri);
		var instance = this.modelController.addInstance(this.diagram, meta_ele);
		this.diagram._sys_d[instance._sys_uri] = {
				uri : instance._sys_uri,
				gtype : 'node',
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
	if(asso && asso.feature === 'child') {
		var instance = this.modelController.addInstance(parent, meta_ele);
		parent_sys_d.child[instance._sys_uri] = {
				uri : instance._sys_uri,
				gtype : 'node',
				x : x,
				y : y,
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
	var casso = srcMeta.getContainAssociation(meta_ele);
	if(casso && casso.feature === 'contain') {
		//pattern 1
		instance = this.modelController.add(src._sys_uri, meta_ele);
	}else{
		casso = this.metaDiagram.getContainAssociation(meta_ele);
		if(casso && casso.feature === 'contain') {
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
		if(srcAsso[i].feature === 'source') {
			this.modelController.addRelationship(instance, src, srcAsso[i]);
		}
	}
	
	/*
	 * dest
	 */
	var destAsso = meta_ele.getAssociations(destMeta);
	for(var i=0;i < destAsso.length;i++) {
		if(destAsso[i].feature === 'target') {
			this.modelController.addRelationship(instance, dest, destAsso[i]);
		}
	}
	
	this.diagram._sys_d[instance._sys_uri] = {
			uri : instance._sys_uri,
			gtype : 'connection',
			points : []
	};
}

DiagramEditor.prototype.ActionDown = function(x, y) {
	if(this.tool == null) {
		/*
		 * ツールを選択していない（Selectツール）
		 */
		var obj = this.find(x, y);
		if(obj == null) {
			/*
			 * キャンバスをクリックした場合
			 */
			this.selected.clear()
			this.dragMode = DiagramEditor.DRAG_RANGE;
		}else{
			/*
			 * ノードをクリックした場合
			 */
			if(this.selected.getSelectedType() == 'multi' && obj.uri in this.selected.getSelectedDatas()) {
				/*
				 * 複数選択していて、今回も選択済みのノードをクリックした場合
				 */
				/*
				 * 何もしない、複数移動へ
				 */
			}else{
				this.selected.clear()
				this.selected.select(obj.uri, obj);
				this.createPropertyArea();
			}
			this.dragMode = DiagramEditor.DRAG_MOVE;
		}
	}else{
		/*
		 * ツールを選択している
		 */
		var metaClass = this.ctool.getClass(this.tool.id);
		var parent_sys_d = this.find(x, y);
		if(parent_sys_d) {
			/*
			 * ノードをクリックした場合
			 */
			var parent = this.modelController.get(parent_sys_d.uri);
			if(metaClass.gtype === 'node') {
				//子ノード追加
				this.addNodePattern2(x, y, metaClass, parent, parent_sys_d);
			}else if(metaClass.gtype === 'connection') {
				//コネクションの追加
				this.dragMode = DiagramEditor.DRAG_RUBBERBAND;
			}
		}else{
			/*
			 * キャンバスをクリックした場合
			 */
			if(metaClass.gtype === 'node') {
				//ノード追加
				this.addNodePattern1(x, y, metaClass);
			}
		}
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
		var meta_ele = this.ctool.getClass(this.tool.id);
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
				if(child.x < x && x < child.x + child.w) {
					if(child.y < y && y < child.y + child.h) {
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
		function findConnection_part() {
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
		if(metaClass.gtype === 'node') {
			drawChild(key, this.diagram._sys_d[key]);
		}else if(metaClass.gtype === 'connection') {
			drawConnection(key, this.diagram._sys_d[key]);
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
	}else if(this.dragMode == DiagramEditor.DRAG_RANGE) {
		self.canvas.drawRect({
			strokeStyle: "#777",
			x: self.drag_start.x, y: self.drag_start.y,
			width: self.drag_move.x - self.drag_start.x, height: self.drag_move.y - self.drag_start.y,
			fromCenter: false}
		);
	}
	function drawChild(ckey, node) {
		var elem = self.modelController.get(ckey);
		var metaClass = self.ctool.getClass(elem._sys_meta);
		var col = "#000";
		if(self.selected.isSelected()){
			if(self.selected.getSelectedType() == 'single') {
				if(self.selected.getSelectedData().uri == ckey)
					col = "#00f";
			}else if(self.selected.getSelectedType() == 'multi') {
				if(ckey in self.selected.getSelectedDatas())
					col = "#00f";
			}
		}
		self.canvas.drawRect({
			strokeStyle: col,
			fillStyle: "#fff",
			x: node.x, y: node.y,
			width: node.w, height: node.h,
			fromCenter: false}
		);
		drawProp(elem, metaClass, node.x, node.y);
		for(var key in node.child) {
			drawChild(key, node.child[key]);
		}
	}
	function drawConnection(key, connection) {
		var elem = self.modelController.get(key);
		var metaClass = self.ctool.getClass(elem._sys_meta);
		var src_d = null, dest_d = null
		for(var akey in metaClass.associations) {
			if(metaClass.associations[akey].feature  === 'source') {
				console.log(elem[akey]);
				src_d = self.diagram._sys_d[elem[akey]];
			}else if(metaClass.associations[akey].feature  === 'target') {
				dest_d = self.diagram._sys_d[elem[akey]];
			}
		}
		if(src_d && dest_d) {
			var s = new Point2D((src_d.x + src_d.w / 2), (src_d.y + src_d.h / 2));
			var e = new Point2D((dest_d.x + dest_d.h / 2), (dest_d.y + dest_d.h / 2));
			var start = 0;
			var end = 0;
			if(connection.points.length == 0) {
				start = self.getConnectionPoint(new Line2D(s.x, s.y, e.x, e.y), src_d);
				end = self.getConnectionPoint(new Line2D(e.x, e.y, s.x, s.y), dest_d);
			}else if(connection.points.length > 0) {
				start = self.getConnectionPoint(new Line2D(s.x, s.y, rel.points[0].x, rel.points[0].y), src_d);
				end = self.getConnectionPoint(new Line2D(e.x, e.y, rel.points[rel.points.length-1].x, rel.points[rel.points.length-1].y), dest_d);
			}
			self.canvas.drawLine({
				  strokeStyle: "#777",
				  strokeWidth: 2,
				  strokeCap: "round",
				  strokeJoin: "miter",
				  x1: start.x, y1: start.y,
				  x2: end.x, y2: end.y
				});
		}
	}
	function drawProp(elem, metaClass,x,y) {
		for(var key in metaClass.properties) {
			var metaProp = metaClass.properties[key];
			var disp = '';
			if(metaProp.upper == 1) {
				if(metaProp.type === 'string') {
					disp = elem[key]
				}
			}
			self.canvas.drawText({
				  fillStyle: "#000",
				  x: x, y: y + 10,
				  text: disp,
				  align: "left",
				  baseline: "middle",
				  font: "16px 'ＭＳ ゴシック'"
				});
		}
	}
}

DiagramEditor.prototype.createPropertyArea = function() {
	if(this.selected.isSelected() == false) return;
	var self = this;
	var props = [];
	var elem = this.modelController.get(this.selected.getSelectedData().uri);
	var metaElem = this.ctool.getClass(elem._sys_meta);
	for(var key in metaElem.properties) {
		props.push({
	        	name: key,
	        	xtype: 'textfield',
	        	fieldLabel: key,
	        	value: elem[key],
	        	listeners : {
	        		change : {
	        			fn : function(textField, newValue) {
	        				console.log(textField.name);
	        				elem[key] = newValue;
	        			}
	        		}
	        	}
			});
	}
	this.wb.getPropertyPanel().setPropertyPanel(props);
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
DiagramEditor.prototype.deleteFromDiagram = function() {
	var self = this;
	if(this.selected) {
		//図から削除
		findnode(this.diagram._sys_d);
		function findnode(nodes) {
			for(var key in nodes) {
				if(nodes[key].uri == self.selected.getSelectedData().uri) {
					delete nodes[key];
					return;
				}
				findnode(nodes[key].child);
			}
		}
		//選択解除
		this.selected = null;
		return true;
	}
	return false;
}

DiagramEditor.prototype.deleteFromModel = function() {
	if(this.selected) {
		//図から削除
		delete this.arino.nodes[this.selected.id];
		//モデルから削除
		this.modelController.del(this.selected.uri);
		//選択解除
		this.selected = null;
		return true;
	}
	return false;
}

DiagramEditor.prototype.copy = function() {
	
}

DiagramEditor.prototype.paste = function() {
	
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
	this.selected.clear();
	
	for(var key in this.diagram._sys_d) {
		var node = this.diagram._sys_d[key];
		if(Rectangle2D.contains(rect, new Point2D(node.x, node.y))) {
			if(Rectangle2D.contains(rect, new Point2D(node.x + node.w, node.y + node.h))) {
				this.selected.select(key, node);
			}
		}
	}
}


DiagramEditor.prototype.getMenuContext = function() {
	var self = this;
	return new Ext.menu.Menu({
	    items: [{
	        id: 'delete-from-diagram',
	        text: '図から削除'
	    },{
	        id: 'delete-from-model',
	        text: 'モデルから削除'
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


DiagramEditor.prototype.getConnectionPoint = function(d, bound) {
	if(d.intersectsLine(bound.x, bound.y, bound.x+bound.w, bound.y)) {
		return d.getConnect(new Line2D(bound.x, bound.y, bound.x+bound.w, bound.y));
	}
	if(d.intersectsLine(bound.x+bound.w, bound.y, bound.x+bound.w, bound.y+bound.h)) {
		return d.getConnect(new Line2D(bound.x+bound.w, bound.y, bound.x+bound.w, bound.y+bound.h));
	}
	if(d.intersectsLine(bound.x+bound.w, bound.y+bound.h, bound.x, bound.y+bound.h)) {
		return d.getConnect(new Line2D(bound.x+bound.w, bound.y+bound.h, bound.x, bound.y+bound.h));
	}
	if(d.intersectsLine(bound.x, bound.y+bound.h, bound.x, bound.y)) {
		return d.getConnect(new Line2D(bound.x, bound.y+bound.h, bound.x, bound.y));
	}
	return new Point2D(bound.x, bound.y);
}

DiagramEditor.SelectedObject = function() {
	var selected_type = 'single';
	var selected_data = null;
	var selected_datas = null;
	var length = 0;
	return {
		select : function(key, node) {
			selected_data = node;
			selected_datas[key] = node;
			length++;
			if(length >= 2) selected_type = 'multi';
		},
		clear : function() {
			selected_data = null;
			selected_datas = {};
			selected_type = 'single';
			length = 0;
		},
		getSelectedType : function() {
			return selected_type;
		},
		setSelectedType : function(t) {
			selected_type = t;
		},
		getSelectedData : function() {
			return selected_data;
		},
		getSelectedDatas : function() {
			return selected_datas;
		},
		isSelected : function() {
			return selected_data != null;
		}
	}
}
