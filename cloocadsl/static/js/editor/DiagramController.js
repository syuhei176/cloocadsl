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
	var self = this;
	
	this.createButton();
	
	var tab = editor_tabs.add({
		id: key,
		title: name,
		html : '<canvas id="canvas_'+self.key+'" width=500 height=400></canvas>',
		closable: 'true',
	});
	current_editor = this;
	editor_tabs.setActiveTab(tab);
	this.canvas = $('#canvas_'+key);
//	window.alert("canvas = "+this.canvas);
	var draw = function() {
//		window.alert("draw" + editor_key);
		self.canvas.drawRect({
			  fillStyle: "#fff",
			  x: 0, y: 0,
			  width: 500,
			  height: 400,
			  fromCenter: false});
		for(var i=0;i < self.diagram.objects.length;i++) {
			var obj = self.diagram.objects[i];
			if(obj.ve.ver_type == 'delete') continue;
			var col = '#000';
			if(self.diagram.objects[i] == self.selected) {
				col = '#00f';
			}
			self.canvas.drawRect({
				  strokeStyle: col,
				  strokeWidth: 2,
				  x: self.diagram.objects[i].bound.x, y: self.diagram.objects[i].bound.y,
				  width: self.diagram.objects[i].bound.width,
				  height: self.diagram.objects[i].bound.height,
				  fromCenter: false
			});
//			var meta_obj = MetaModelController.getMetaObject(g_metamodel.metadiagram, obj.meta_id)
			var h = 0;
			for(var j=0;j < obj.properties.length;j++) {
				var prop = obj.properties[j];
				for(var k=0;k < prop.children.length;k++) {
					$("canvas").drawText({
						  fillStyle: "#000",
//						  strokeStyle: "#000",
//						  strokeWidth: 5,
						  x: obj.bound.x+20, y: obj.bound.y + h * 20 + 16,
						  text: prop.children[k].value,
						  align: "center",
						  baseline: "middle",
						  font: "16px 'ＭＳ ゴシック'"
						});
					h++;
				}
			}
		}
		for(var i=0;i < self.diagram.relationships.length;i++) {
			var rel = self.diagram.relationships[i];
			if(rel.ve.ver_type == 'delete') continue;
			var col = '#000';
			if(self.diagram.relationships[i] == self.selected) {
				col = '#00f';
			}
			var src = ModelController.getObject(self.diagram, self.diagram.relationships[i].src);
			var dest = ModelController.getObject(self.diagram, self.diagram.relationships[i].dest);
			var startx = src.bound.x;
			var starty = src.bound.y;
			var endx = dest.bound.x;
			var endy = dest.bound.y;
			self.canvas.drawLine({
				  strokeStyle: col,
				  strokeWidth: 2,
				  strokeCap: "round",
				  strokeJoin: "miter",
				  x1: startx, y1: starty,
				  x2: endx, y2: endy
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
			this.selected.bound.x = x - 10;
			this.selected.bound.y = y - 10;
		}
	}
}

DiagramEditor.prototype.ActionDown = function(x, y) {
	if(this.tool == null) {
		if(this.clicknode(x, y)) {
			this.dragMode = DiagramEditor.DRAG_MOVE;
		}else if(this.clickedge(x, y)) {
			
		}else{
			this.dragMode = DiagramEditor.DRAG_NONE;
			this.selected = null;
		}
	}else if(this.tool.classname == 'MetaObject'){
		this.addObject(x, y);
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
	}
	this.dragMode = DiagramEditor.DRAG_NONE;
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
		if(this.click_a_edge(this.diagram.relationships[i], x, y)) return true;
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
			console.log("click_a_edge true");
			this.selected = rel;
			this.fireSelectRelationship(this.selected);
			return true;
		}
	}
	console.log("click_a_edge false");
	return false;
}



DiagramEditor.prototype.createButton = function() {
	var self = this;
	var toolpanel = Ext.getCmp('toolpanel');
	toolpanel.removeAll();
	var tools = g_metamodel.metadiagram.metaobjects.concat(g_metamodel.metadiagram.metarelations);
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
		    enableToggle: true,
		    toggleGroup: 'tools',
		    listeners: {
		        click: function() {
		    		var tool = tools[this.index];
		            // this == the button, as we are in the local scope
		            self.tool = tool;
		        },
		        mouseover: function() {
		            // this == the button, as we are in the local scope
		        }
		    }
		});
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
		this.selected.ve.ver_type = 'delete';
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
	this.diagram.objects.push(obj);
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
		this.diagram.relationships.push(rel);
//		this.fireOnAddRelationship(rel);
		return rel;
	}
	return null;
}

DiagramEditor.prototype.findNode = function(p) {
	for(var i=0;i < this.diagram.objects.length;i++) {
		var obj = this.diagram.objects[i];
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
		if(ele.properties[i] == undefined) {
			ele.properties[i] = new PropertyList();
			ele.properties[i].children[0] = new Property();
		}
		var prop_tab = null;
		if(meta_ele.properties[i].data_type == MetaProperty.COLLECTION_STRING) {
			prop_tab = PropertyPanel.CollectionString(meta_ele.properties[i], ele.properties[i], ele)
		}else{
			if(meta_ele.properties[i].widget == MetaProperty.INPUT_FIELD) {
				prop_tab = PropertyPanel.InputField(meta_ele.properties[i], ele.properties[i], ele)
			}else if(meta_ele.properties[i].widget == MetaProperty.FIXED_LIST) {
				prop_tab = PropertyPanel.FixedList(meta_ele.properties[i], ele.properties[i], ele)
			}
		}
		prop_tab.index = i;
		property_tabs.add(prop_tab);
	}
	Ext.getCmp('propertypanel').add(property_tabs);

}

function PropertyPanel(){}

PropertyPanel.InputField = function(meta_prop, prop, ele) {
	var prop_tab = {
            title: meta_prop.name,
            html : '',
            items: [{
	  	        	   xtype: 'textfield',
  	        		   value: prop.children[0].value,
//  	        		   index: i,
  	        		   listeners: {
  	        			   change: {
  	        				   fn: function(field, newValue, oldValue, opt) {
 	        						console.log('change'+this.index);
 	        						prop.children[0].value = newValue;
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
  	        		   value: prop.children[0].value,
//  	        		   index: i,
  	        		   listeners: {
  	        			   change: {
  	        				   fn: function(field, newValue, oldValue, opt) {
 	        						console.log('change'+this.index);
 	        						prop.children[0].value = newValue;
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
PropertyPanel.CollectionString = function(meta_prop, prop, ele) {
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
		 dummy.push(prop.children[i].value);
	 }
	 var store = Ext.create('Ext.data.ArrayStore', {
         model: 'Collection',
         data: dummy
     });
	 var additem = function() {
		 prop.children.push(new Property());
	 }
	 var optionitem = function() {
		 Ext.Msg.prompt('','',function(btn,text){
			 if(btn != 'cancel') {
				 prop.children[PropertyPanel.selected[0]].value = text;
			 }
		 },null,true);
	 }
	 var deleteitem = function() {
		 for(var i=0;i<PropertyPanel.selected.length;i++) {
			 prop.children.splice(PropertyPanel.selected[i], 1);
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
	                text:'Add Something',
	                tooltip:'Add a new row',
	                iconCls:'add',
	                handler : additem
	            }, '-', {
	                text:'Options',
	                tooltip:'Set options',
	                iconCls:'option',
	                handler : optionitem
	            },'-',{
	                itemId: 'removeButton',
	                text:'Remove Something',
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
	var h = 0;
	for(var j=0;j < obj.properties.length;j++) {
		var prop = obj.properties[j];
		for(var k=0;k < prop.children.length;k++) {
			h++;
		}
	}
	obj.bound.height = h * 20 + 10;
}
