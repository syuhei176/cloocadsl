/**
 * 
 * @param name 名前
 * @param key　唯一のキー
 */
function DiagramEditor(name, key, diagram) {
	
	this.name = name;
	this.key = key;
	this.diagram = diagram;
	this.selected = null;
	this.dragMode = 0;
	var self = this;
	
	this.createButton();
	
	var tab = editor_tabs.add({
		id: key,
		title: name,
		html : '<canvas id="canvas_'+self.key+'" width=400 height=400></canvas>',
		closable: 'true',
	});
	editor_tabs.setActiveTab(tab);
	this.canvas = $('#canvas_'+key);
//	window.alert("canvas = "+this.canvas);
	var draw = function() {
//		window.alert("draw" + editor_key);
		self.canvas.drawRect({
			  fillStyle: "#fff",
			  x: 0, y: 0,
			  width: 400,
			  height: 400,
			  fromCenter: false});
		for(var i=0;i < self.diagram.objects.length;i++) {
			self.canvas.drawRect({
				  strokeStyle: "#000",
				  strokeWidth: 2,
				  x: self.diagram.objects[i].x, y: self.diagram.objects[i].y,
				  width: 50,
				  height: 50,
				  fromCenter: false
			});
		}
		for(var i=0;i < self.diagram.relationships.length;i++) {
			var startx = self.diagram.relationships[i].src.x;
			var starty = self.diagram.relationships[i].src.y;
			var endx = self.diagram.relationships[i].dest.x;
			var endy = self.diagram.relationships[i].dest.y;
			self.canvas.drawLine({
				  strokeStyle: "#000",
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
		draw();
		self.dragMode = 0;
	});
	draw();
}

DiagramEditor.prototype.ActionMove = function(x, y) {
	if(this.dragMode == 1) {
		if(this.selected != null) {
			this.selected.x = x - 10;
			this.selected.y = y - 10;
		}
	}
}

DiagramEditor.prototype.ActionDown = function(x, y) {
	if(this.clicknode(x, y)) {
		this.dragMode = 1;
	}
}

DiagramEditor.prototype.clicknode = function(x, y) {
	for(var i=0;i < this.diagram.objects.length;i++) {
		if(this.diagram.objects[i].x < x &&  x < this.diagram.objects[i].x + 50) {
			if(this.diagram.objects[i].y < y && y < this.diagram.objects[i].y + 50) {
				this.selected = this.diagram.objects[i];
				return true;
			}
		}
	}
	return false;
}

DiagramEditor.prototype.createButton = function() {
	for(var i=0;i < 2;i++) {
		b = Ext.create('Ext.Button', {
		    text     : 'Button',
/*		    renderTo : Ext.get('toolpanel'),*/
		    listeners: {
		        click: function() {
		            // this == the button, as we are in the local scope
		            this.setText('I was clicked!');
		        },
		        mouseover: function() {
		            // set a new config which says we moused over, if not already set
		            if (!this.mousedOver) {
		                this.mousedOver = true;
		                alert('You moused over a button!\n\nI wont do this again.');
		            }
		        }
		    }
		});
		Ext.getCmp('toolpanel').items.add(b);
	}
}

function addObject(x, y) {
	obj = new Object();
	obj.id = getNewId();
	obj.x = x;
	obj.y = y;
}

function addRelationship(src, dest) {
	rel = new Relationshi();
	rel.id = getNewId();
	rel.src = src;
	rel.dest = dest;
}
