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
function DiagramEditor(key, name, diagram, modelController, metamodelController, notationController, toolController, wb) {
	var self = this;
	this.name = name;
	this.key = key;
	this.diagram = diagram;
	this.modelController = modelController;
	this.wb = wb;
	this.metaDataController = metamodelController;
	this.notationController = notationController;
	this.toolController = toolController;
	console.log('DiagramEditor::' + this.diagram.meta_uri);
	this.diagram_metaclass = this.metaDataController.get(this.diagram.meta_uri);
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

/**
 * 
 */
DiagramEditor.prototype.addNodePattern1 = function(x, y, meta_ele, notation) {
	//this.diagramがヒント
	//ダイアグラムをヒントにしてノードの追加
	var klass = this.modelController.addClass('root.test', meta_ele, notation);
	//オブジェクトの参照元の解決（＊上の関数内でやる可能性もあり）
	candidacy = [this.diagram];
	var contFeature_array = notation.containmentFeature.split('.');
	var property_name = contFeature_array.pop();
	var contFeature = contFeature_array.join('.');
	//containmentの解決
	for(var i=0;i < candidacy.length;i++) {
		if(candidacy[i].meta_uri == contFeature) {
			console.log(property_name);
			candidacy[i].properties[property_name].push(klass.id);
		}
	}
	//・referの解決
	//位置の設定
	klass.properties.x = x;
	klass.properties.y = y;
	console.log('(' + x + ',' + y + ')に「'+meta_ele.name+'」ノードを追加');
}

DiagramEditor.prototype.addConnection = function(src, dest, meta_ele, notation) {
	console.log('(' + x + ',' + y + ')に「'+meta_ele.name+'」コネクションを追加');
	//srcとdestがヒント
	//srcとdestをヒントにしてコネクションの追加
	var klass = this.modelController.newClass('root.test', meta_ele, notation);
	//オブジェクトの参照元の解決（＊上の関数内でやる可能性もあり）
	//・containmentの解決
	this.klass.properties[src].push(klass.id);
	notation.containmentFeature
	//・referの解決
	notation.sourceFeature
	notation.targetFeature
	this.klass.properties['src'].push(klass.id);
	this.klass.properties['dest'].push(klass.id);
	//位置の設定
	klass.properties.x = x;
	klass.properties.y = y;
}

DiagramEditor.prototype.ActionDown = function(x, y) {
	if(this.tool == null) {
		
	}else{
		var meta_ele = this.metaDataController.get(this.tool.uri);
		var notation = this.notationController.get(this.tool.uri);
		console.log(notation);
		if(notation.graph_element_type == 'node') {
			this.addNodePattern1(x, y, meta_ele, notation);
		}else if(notation.type == 'connection') {
			//コネクションの追加
			this.dragMode = DiagramEditor.DRAG_RUBBERBAND;
		}
		/*
		if(meta_ele.meta == 'C') {
			//クラスの追加
			var klass = this.modelController.newClass('root.test', meta_ele, this.notationController.get(this.tool.uri));
			klass.properties.x = x;
			klass.properties.y = y;
			this.diagram.properties[this.tool.attr_name].push(klass);
//			this.modelController.addClass('root.test', meta_ele);
		}else if(meta_ele.meta == 'A') {
		}
		*/
		console.log(this.modelController.model);
	}
	/*
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
	}else{
		console.log('click tool='+this.metaDataController.get(this.tool.uri).name);
		
		this.modelController.addClass('root.test', this.metaDataController.get(this.tool.uri))
		
		console.log(this.modelController.model);
	}
	*/
	this.drag_start.x = x;
	this.drag_start.y = y;
	this.draw();
}

DiagramEditor.prototype.ActionUp = function(x, y) {
	this.drag_end.x = x;
	this.drag_end.y = y;
	if(this.dragMode == DiagramEditor.DRAG_RUBBERBAND) {
		var meta_ele = this.metaDataController.get(this.tool.uri);
		var assoc = this.modelController.newAssociation('root.test', meta_ele, this.notationController.get(this.tool.uri));
		/*
		this.drag_start
		this.drag_end
		this.notationController.get(this.tool.uri)
		*/
		assoc.properties.m1 = x;
		assoc.properties.m2 = y;
		this.diagram.properties[this.tool.attr_name].push(klass.id);
		/*
		this.diagramController.addRelationship(this.drag_start, this.drag_end, this.tool.id);
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

DiagramEditor.prototype.click = function() {
	
}


DiagramEditor.prototype.draw = function() {
//	this.canvas = $('#canvas-'+this.key);
	this.canvas.drawRect({fillStyle: "#fff",x: 0, y: 0,width: this.width,height: this.height, fromCenter: false});
	for(var key in this.diagram.properties) {
		var property = this.diagram.properties[key];
		for(var j=0;j < property.length;j++) {
			var node_id = property[j];
			var node = this.modelController.get('root.test.' + node_id);
			var notation = this.notationController.get(node.meta_uri);
			if(notation != undefined) {
				if(notation.shape == 'rect') {
					this.canvas.drawRect({
						strokeStyle: "#000",
						x: node.properties.x, y: node.properties.y,
						width: 32, height: 32,
						fromCenter: false}
					);
				}
			}
		}
	}
}

DiagramEditor.prototype.createButton = function() {
	var self = this;
	if(this.tool_palet == undefined || this.tool_palet == null) {
		items = [];
		for(var key in this.toolController.getlist()) {
			var tool = this.toolController.getlist()[key];
			var item = {
			    	xtype : 'button',
			    	text : tool.name,
			    	key : key,
			    	handler :function(btn){
			    		console.log('test '+btn.key);
			    		self.tool = self.toolController.getlist()[btn.key];
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
