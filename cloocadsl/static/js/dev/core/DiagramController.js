/**
 * 
 * @param name 名前
 * @param key　唯一のキー
 */
function DiagramEditor(name, key, diagram) {
	
	this.name = name;
	this.key = key;
	this.diagram = diagram;
	this.tool = null;
	this.drag_start = new Point2D();
	this.drag_move = new Point2D();
	this.drag_end = new Point2D();
	this.selected = null;
	this.dragMode = 0;
	this.select_button = null;
	var self = this;
	
//	this.createButton();
	this.width = Ext.getCmp('centerpanel').getWidth();
	this.height = Ext.getCmp('centerpanel').getHeight();
	var tab = editor_tabs.add({
		id: this.key,
		title: name,
		html : '<canvas id="canvas_'+this.key+'" width='+this.width+' height='+this.height+'></canvas>',
		closable: 'true',
	});
	tab.on('activate', function(){
		self.createButton();
		current_editor = self;
		});
	editor_tabs.setActiveTab(tab);
	this.canvas = $('#canvas_'+this.key);
//	window.alert("canvas = "+this.canvas);
	var draw = function() {
//		console.log('draw '+self.key)
//		window.alert("draw" + editor_key);
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
					  strokeStyle: col, strokeWidth: 2,
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
					  cornerRadius: 2
				});
			}else if(meta_ele.graphic == 'circle') {
				$("canvas").drawArc({
					  strokeStyle: col, strokeWidth: 2,
					  x: obj.bound.x + obj.bound.width / 2, y: obj.bound.y + obj.bound.width / 2,
					  radius: obj.bound.width / 2,
					  start: 0, end: 359
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
						self.canvas.drawText({
							  fillStyle: "#000",
							  x: obj.bound.x+obj.bound.width / 2, y: obj.bound.y + h * 20 + 16,
							  text: p.value,
							  align: "center",
							  baseline: "middle",
							  font: "16px 'ＭＳ ゴシック'"
							});
						h++;
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
		if(self.dragMode == DiagramEditor.DRAG_RUBBERBAND) {
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
//	var context = this.canvas.getContext('2d');
	this.canvas.mousemove(function(e){
		var rect = e.target.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
		self.ActionMove(mouseX, mouseY)
		draw();
	});
	this.canvas.mousedown(function(e){
		var rect = e.target.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
		self.ActionDown(mouseX, mouseY)
		draw();
	});
	this.canvas.mouseup(function(e){
		var rect = e.target.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
		self.ActionUp(mouseX, mouseY)
		draw();
	});
	draw();
	this.draw = draw;
}

/**
 * static変数
 */
DiagramEditor.DRAG_NONE = 0;
DiagramEditor.DRAG_RUBBERBAND = 1;
DiagramEditor.DRAG_MOVE = 2;
DiagramEditor.DRAG_POINT = 3;
DiagramEditor.DRAG_RANGE = 4;

DiagramEditor.prototype.ActionMove = function(x, y) {
	this.drag_move.x = x;
	this.drag_move.y = y;
	if(this.dragMode == DiagramEditor.DRAG_MOVE) {
		if(this.selected != null) {
			this.updateObject(this.selected,Number(x-10),Number(y-10));
		}
	}
}

DiagramEditor.prototype.updateObject = function(obj, x, y) {
	obj.bound.x = x - 10;
	obj.bound.y = y - 10;
	VersionElement.update(obj.ve);
}

DiagramEditor.prototype.ActionDown = function(x, y) {
	if(this.tool == null) {
		if(this.clicknode(Number(x), Number(y))) {
			this.dragMode = DiagramEditor.DRAG_MOVE;
		}else if(this.clickedge(x, y)) {
//			this.dragMode = DiagramEditor.DRAG_POINT;
		}else{
			this.dragMode = DiagramEditor.DRAG_NONE;
			this.selected = null;
		}
	}else if(this.tool.classname == 'MetaObject'){
		this.addObject(x, y);
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
		this.addRelationship(this.drag_start, this.drag_end);
		this.select_button.toggle(true);
	} else if(this.dragMode == DiagramEditor.DRAG_POINT) {
		this.movePoint(this.selected, this.drag_start, this.drag_end);
	}
	this.dragMode = DiagramEditor.DRAG_NONE;
}

DiagramEditor.prototype.deletePoint = function() {
	var rel = this.selected;
	if(rel == null) return;
	rel.points.length = 0;
}

DiagramEditor.prototype.movePoint = function(rel, s, d) {
	if(rel != null) {
		var flg = true;
		for(var i=0;i < rel.points.length;i++) {
			if(Point2D.distanceSq(rel.points[i], s) < 14) {
				rel.points[i].x = d.x;
				rel.points[i].y = d.y;
				flg = false;
			}
		}
		if(flg) {
			if(rel.points.length < 2) {
				console.log('x'+d.x+',y'+d.y);
				rel.points.push(new Point2D(d.x, d.y));
			}
		}
	}
}

DiagramEditor.prototype.clicknode = function(x, y) {
	var obj = this.findNode(new Point2D(x, y));
	if(obj != null) {
		if(obj.ve.ver_type == "delete") return false;
		this.selected = obj;
		this.fireSelectObject(this.selected)
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
//			console.log("click_a_edge true");
			if(rel == this.selected) this.dragMode = DiagramEditor.DRAG_POINT;
			this.selected = rel;
			this.fireSelectRelationship(this.selected);
			return true;
		}
	}
//	console.log("click_a_edge false");
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
	console.log("create button");
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
				this.deleteObject(this.selected.id);
			}
		}
		for(var i=0;i < this.diagram.relationships.length;i++) {
			if(this.diagram.relationships[i] == this.selected.id) {
				this.deleteRelationship(this.selected.id);
			}
		}
		this.draw();
	}
}

DiagramEditor.prototype.deleteObject = function(id) {
	if(g_model.objects[id].ve.ver_type == 'add') {
		for(var i=0;i < this.diagram.objects.length;i++) {
			if(this.diagram.objects[i] == id) {
				this.diagram.objects.splice(i, 1);
			}
		}
		delete g_model.objects[id]
	}else{
		g_model.objects[id].ve.ver_type = 'delete';		
	}
	for(var i=0;i < this.diagram.relationships.length;i++) {
		
		if(g_model.relationships[this.diagram.relationships[i]].src == id || g_model.relationships[this.diagram.relationships[i]].dest == id) {
			this.deleteRelationship(this.diagram.relationships[i]);
		}
	}
}

DiagramEditor.prototype.deleteRelationship = function(id) {
	if(g_model.relationships[id].ve.ver_type == 'add') {
		for(var i=0;i < this.diagram.relationships.length;i++) {
			if(this.diagram.relationships[i] == id) this.diagram.relationships.splice(i, 1);
		}
		delete g_model.relationships[id]
	}else{
		g_model.relationships[id].ve.ver_type = 'delete';		
	}
}

/**
 * addObject: Objectを追加する
 * @param x
 * @param y
 */
DiagramEditor.prototype.addObject = function(x,y) {
	obj = new Object(this.tool.id);
	obj.bound.x = x;
	obj.bound.y = y;
	obj.ve.ver_type = 'add';
	VersionElement.update(this.diagram.ve);
	g_model.objects[obj.id] = obj;
	this.diagram.objects.push(obj.id);
}

/**
 * addRelationship: Relationshipを追加する
 * @param s:開始位置
 * @param e:終端位置
 */
DiagramEditor.prototype.addRelationship = function(s,e) {
	var start = this.findNode(s);
	var end = this.findNode(e);
	if(start != null && end != null) {
//		if(!checkBinding(meta_rel, start, end)) return null;
		var rel = new Relationship(this.tool.id);
//		rel.id = IdGenerator.getNewLongId();
//		rel.meta = meta_rel;
		rel.src = start.id;
		rel.dest = end.id;
		rel.ve.ver_type = 'add';
		VersionElement.update(this.diagram.ve);
		/*
		 * 自己遷移
		 */
		if(rel.src == rel.dest) {
			rel.points.push(new Point2D(start.bound.x + 10, start.bound.y + 50));
			rel.points.push(new Point2D(start.bound.x + 50, start.bound.y + 50));
			rel.points.push(new Point2D(start.bound.x + 50, start.bound.y + 10));
		}
		/*
		rel.ve.ver_type = "add";
		for(MetaProperty metaprop : rel.meta.properties) {
			PropertyList proplist = new PropertyList();
			proplist.meta = metaprop;
			Property prop = new Property();
			prop.meta = metaprop;
			prop.ve.ver_type = "add";
			if(prop.meta.widget.matches(MetaProperty.FIXED_LIST)) {
				String[] list = prop.meta.exfield.split("&");
				prop.content = list[0];
			}
			proplist.add(prop);
			rel.properties.add(proplist);
		}
		*/
		g_model.relationships[rel.id] = rel;
		this.diagram.relationships.push(rel.id);
//		this.fireOnAddRelationship(rel);
		return rel;
	}
	return null;
}

DiagramEditor.prototype.findNode = function(p) {
	for(var i=0;i < this.diagram.objects.length;i++) {
		var obj_id = this.diagram.objects[i];
		var obj = g_model.objects[obj_id];
//		console.log("x="+p.x+", y="+p.y+", obj.x="+obj.bound.x+", obj.y="+obj.bound.y);
		if(Rectangle2D.contains(obj.bound, p)) {
			return obj;
		}
	}
	return null;
}

function addRelationship(src, dest) {
	rel = new Relationship(this.tool.id);
	rel.src = src;
	rel.dest = dest;
}

DiagramEditor.prototype.fireSelectObject = function(selected) {
	var meta_obj = MetaModelController.getMetaObject(g_metamodel.metadiagram, selected.meta_id)
	this.createPropertyPanel(meta_obj, selected);
}

DiagramEditor.prototype.fireSelectRelationship = function(selected) {
	var meta_rel = MetaModelController.getMetaRelation(g_metamodel.metadiagram, selected.meta_id)
	this.createPropertyPanel(meta_rel, selected);
}

/**
 * createPropertyPanel
 * プロパティパネルを作成する
 * @param meta_ele
 * @param ele
 */
DiagramEditor.prototype.createPropertyPanel = function(meta_ele, ele) {
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
			var new_p = new Property();
			g_model.properties[new_p.id] = new_p;
			plist.children[0] = new_p.id;
			ele.properties.push(plist);
			prop = plist;
		}
		var prop_tab = null;
		if(meta_prop.data_type == MetaProperty.COLLECTION_STRING) {
			prop_tab = PropertyPanel.CollectionString(this, meta_prop, prop, ele)
		}else{
			if(meta_prop.widget == MetaProperty.INPUT_FIELD) {
				prop_tab = PropertyPanel.InputField(meta_prop, prop, ele)
			}else if(meta_prop.widget == MetaProperty.FIXED_LIST) {
				prop_tab = PropertyPanel.FixedList(meta_prop, prop, ele)
			}
		}
		prop_tab.index = i;
		property_tabs.add(prop_tab);
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

PropertyPanel.InputField = function(meta_prop, prop, ele) {
	var p = g_model.properties[prop.children[0]];
	var prop_tab = {
            title: meta_prop.name,
            html : '',
            items: [{
	  	        	   xtype: 'textfield',
  	        		   value: p.value,
//  	        		   index: i,
  	        		   listeners: {
  	        			   change: {
  	        				   fn: function(field, newValue, oldValue, opt) {
 	        						console.log('change'+this.index);
 	        						p.value = newValue;
 	        						VersionElement.update(p.ve);
//  	        					 ele.properties[this.index].children[0].value = newValue;
  	        					 calObjHeight(ele);
  	        				   }
  	        			   }
  	        		   }
                  }]
		};
	return prop_tab;
}
PropertyPanel.FixedList = function(meta_prop, prop, ele) {
	var p = g_model.properties[prop.children[0]];
	var strs = meta_prop.exfield.split('&');
	var datas = new Array();
	for(var j=0;j < strs.length;j++) datas.push({"name":strs[j]});
	var states = Ext.create('Ext.data.Store', {
	    fields: ['name'],
	    data : datas
	});
	var prop_tab = {
            title: meta_prop.name,
            html : '',
            items: [
                  {
	  	        	   xtype: 'combobox',
	  	        	   store: states,
	  	        	    queryMode: 'local',
	  	        	    displayField: 'name',
	  	        	    valueField: 'name',
  	        		   value: p.value,
//  	        		   index: i,
  	        		   listeners: {
  	        			   change: {
  	        				   fn: function(field, newValue, oldValue, opt) {
 	        						p.value = newValue;
 	        						g_model.properties[prop.children[0]].value = newValue;
 	        						VersionElement.update(p.ve);
//  	        					 ele.properties[this.index].children[0].value = newValue;
  	        					 calObjHeight(ele);
  	        				   }
  	        			   }
  	        		   }
                  }
                  ]
		};
	return prop_tab;
}
PropertyPanel.selected = new Array();
PropertyPanel.CollectionString = function(dc, meta_prop, prop, ele) {
	 var selModel = Ext.create('Ext.selection.CheckboxModel', {
	        listeners: {
	            selectionchange: function(sm, selections) {
	                grid4.down('#removeButton').setDisabled(selections.length == 0);
	                for(var i=0;i < selections.length;i++) {
	                	PropertyPanel.selected = new Array();
	                	PropertyPanel.selected.push(selections[i].index);
	                	/*
	                	for(var j=0;j < prop.children.length;j++) {
	                		prop.children[j]
	                	}
	                	*/
	                	console.log(selections[i].index);
	                }
	            }
	        }
	    });
	    Ext.define('Collection', {
	        extend: 'Ext.data.Model',
	        fields: [{name: 'string'}]
	    });
	 var dummy = new Array();
	 for(var i=0;i < prop.children.length;i++) {
		var p = g_model.properties[prop.children[i]];
		if(p.ve.ver_type != 'delete') dummy.push(p.value);
	 }
	 var store = Ext.create('Ext.data.ArrayStore', {
         model: 'Collection',
         data: dummy
     });
	 var additem = function() {
		 var new_p = new Property();
		 g_model.properties[new_p.id] = new_p;
		 prop.children.push(new_p.id);
//		 dc.createPropertyPanel()
	 }
	 var optionitem = function() {
		 Ext.Msg.prompt('','',function(btn,text){
			 if(btn != 'cancel') {
				 var p = g_model.properties[prop.children[PropertyPanel.selected[0]]];
				 p.value = text;
				 VersionElement.update(p.ve);
			 }
		 },null,true);
	 }
	 var deleteitem = function() {
		 for(var i=0;i<PropertyPanel.selected.length;i++) {
			 if(p.ve.ver_type == 'add') {
				 delete g_model.properties[prop.children[PropertyPanel.selected[i]]];
				 prop.children.splice(PropertyPanel.selected[i], 1);
			 }else{
				 g_model.properties[prop.children[PropertyPanel.selected[i]]].ve.ver_type = 'delete';
			 }
		 }
	 }
	    var grid4 = Ext.create('Ext.grid.Panel', {
	        id:'button-grid',
	        store: store,
	        columns: [
	            {text: "string", flex: 1, sortable: true, dataIndex: 'string'}
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
	var h = 0;
	var w = 4;
	for(var j=0;j < obj.properties.length;j++) {
		var plist = obj.properties[j];
		for(var k=0;k < plist.children.length;k++) {
			h++;
			var prop = g_model.properties[plist.children[k]];
			if(w < prop.value.length) w = prop.value.length;
		}
	}
	obj.bound.height = h * 20 + 10;
	obj.bound.width = w * 8 + 10;
}
