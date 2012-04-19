function DiagramController(diagram) {
	this.diagram = diagram;
	this.listeners = new Array();
}

DiagramController.prototype.deleteObject = function(id) {
	console.log('delete object id='+id+','+g_model.objects[id].ve.ver_type);
	if(g_model.objects[id].ve.ver_type == 'add') {
		for(var i=0;i < this.diagram.objects.length;i++) {
			if(this.diagram.objects[i] == id) {
				this.diagram.objects.splice(i, 1);
			}
		}
		delete g_model.objects[id]
	}else{
		g_model.objects[id].ve.ver_type = 'delete';
		VersionElement.update(this.diagram.ve);
	}
	for(var i=0;i < this.diagram.relationships.length;i++) {
		if(g_model.relationships[this.diagram.relationships[i]].src == id || g_model.relationships[this.diagram.relationships[i]].dest == id) {
			this.deleteRelationship(this.diagram.relationships[i]);
		}
	}
}

DiagramController.prototype.deleteRelationship = function(id) {
	console.log('delete relationship id='+id+','+g_model.relationships[id].ve.ver_type);
	if(g_model.relationships[id].ve.ver_type == 'add') {
		for(var i=0;i < this.diagram.relationships.length;i++) {
			if(this.diagram.relationships[i] == id) this.diagram.relationships.splice(i, 1);
		}
		delete g_model.relationships[id]
	}else{
		g_model.relationships[id].ve.ver_type = 'delete';		
		VersionElement.update(this.diagram.ve);
	}
}

/**
 * addObject: Objectを追加する
 * @param x
 * @param y
 */
DiagramController.prototype.addObject = function(x,y,meta_id) {
	obj = new Object(meta_id);
	obj.bound.x = x;
	obj.bound.y = y;
	obj.ve.ver_type = 'add';
	VersionElement.update(this.diagram.ve);
	g_model.objects[obj.id] = obj;
	this.diagram.objects.push(obj.id);
	this.addElement(obj, g_metamodel.metaobjects[obj.meta_id])
	console.log('add object id='+obj.id+','+obj.ve.ver_type);
}

/**
 * addRelationship: Relationshipを追加する
 * @param s:開始位置
 * @param e:終端位置
 */
DiagramController.prototype.addRelationship = function(s,e,meta_id) {
	var start = this.findNode(s);
	var end = this.findNode(e);
	if(start != null && end != null) {
//		if(!checkBinding(meta_rel, start, end)) return null;
		var rel = new Relationship(meta_id);
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
		this.addElement(rel, g_metamodel.metarelations[rel.meta_id])
//		this.fireOnAddRelationship(rel);
		console.log('add relationship id='+rel.id+','+rel.ve.ver_type);
		return rel;
	}
	return null;
}

DiagramController.prototype.addElement = function(ele, meta_ele) {
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
				this.addProperty(plist, meta_prop);
			}
			ele.properties.push(plist);
		}
	}
}

/**
 * addProperty
 */
DiagramController.prototype.addProperty = function(plist, meta_prop, content) {
	var new_p = new Property();
	new_p.meta_id = meta_prop.id;
	if(content != undefined) new_p.value = content;
	g_model.properties[new_p.id] = new_p;
	plist.children.push(new_p.id);
	console.log('add property id='+new_p.id+','+new_p.ve.ver_type);
}

/**
 * deleteProperty
 */
DiagramController.prototype.deleteProperty = function() {
	console.log('add property id='+new_p.id+','+new_p.ve.ver_type);
}

DiagramController.prototype.updateProperty = function(p, newValue, ele) {
	p.value = newValue;
	VersionElement.update(p.ve);
	this.fireUpdateProperty(p, newValue, ele);
}

DiagramController.prototype.findNode = function(p) {
	for(var i=0;i < this.diagram.objects.length;i++) {
		var obj_id = this.diagram.objects[i];
		var obj = g_model.objects[obj_id];
		if(Rectangle2D.contains(obj.bound, p)) {
			return obj;
		}
	}
	return null;
}

DiagramController.prototype.on = function(event, fn) {
	this.listeners.push({event: event, fn: fn});
}

DiagramController.prototype.fireUpdateProperty = function(p, newValue, parent) {
	for(var i=0;i<this.listeners.length;i++) {
		if(this.listeners[0].event == 'updateProperty') {
			this.listeners[0].fn(p, newValue, parent);
		}
	}
}


