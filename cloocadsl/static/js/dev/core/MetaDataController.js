/**
 * 
 * @returns
 */
function MetaDataController() {
	this.meta_structure = null;
	this.elements = {};
	this.changelisteners = [];
}

MetaDataController.prototype.addChangeListener = function(l) {
	this.changelisteners.push(l);
}

MetaDataController.prototype.reset = function(s) {
	this.meta_structure = s;
}

/**
 * w
 */
MetaDataController.prototype.load = function() {
	if(g_toolinfo.structure != null) {
		this.meta_structure = g_toolinfo.structure;
	}else{
		this.meta_structure = new MetaStructure(g_toolinfo.toolkey);
	}
	/*
	var self = this;
	$.post('/wb/get-metastructure', { id : toolid },
			function(data) {
				if(data) {
					console.log('loaded json string = '+data);
					if(data == null || data.length < 3) {
						self.meta_structure = new MetaStructure();
					}else{
						self.meta_structure = JSON.parse(data);
					}
				}
			}, "json");
	*/
}

/**
 * 
 */
MetaDataController.prototype.save = function() {
	var json_text = JSON.stringify(this.meta_structure);
	console.log('saved json string = ' + json_text);
	$.post('/wb-api/save', { toolkey : g_toolinfo.toolkey, content : json_text },
			function(data) {
				if(data) {
				}
			}, "json");
}

/*
 * リスト取得
 */

/**
 * 
 */
MetaDataController.prototype.getPackages = function() {
	return this.meta_structure.nestingPackages;
}

/*
 * 基本操作（get,add,del,update）
 */

MetaDataController.prototype.set = function(uri, attr, value) {
	this.get(uri)[attr] = value;
}


MetaDataController.prototype.get = function(uri) {
	console.log('MetaModelController::get(' + uri + ')');
	if(uri == this.meta_structure.toolkey) {
		return this.meta_structure;
	}
	var uri_array = uri.split('.');
	uri_array.shift();
	return get_part1(this.meta_structure, uri_array);
	/**
	 * 
	 * @param element
	 * @param uri_array
	 * @returns
	 */
	function get_part1(element, uri_array) {
		var elem = one_phase(element, uri_array[0])
		if(uri_array.length == 1) {
			return elem;
		}else{
			uri_array.shift();
			return get_part1(elem, uri_array);
		}
	}
	/**
	 * elementの子の中でfinding_elementを探す
	 * @param element
	 * @param finding_name
	 */
	function one_phase(element, finding_name) {
		if(element.meta == 'C') {
			//elementがクラスの場合
			//elementの子関連を検索
			if(element.associations.hasOwnProperty(finding_name)) {
				return element.associations[finding_name];
			}
			//elementのプロパティを検索
			if(element.properties.hasOwnProperty(finding_name)) {
				return element.properties[finding_name];
			}
		}else{
			//elementがパッケージの場合
			//elementの子パッケージを検索
			if(element.nestingPackages.hasOwnProperty(finding_name)) {
				return element.nestingPackages[finding_name]
			}
			//elementの子クラスを検索
			if(element.content.classes.hasOwnProperty(finding_name)) {
				return element.content.classes[finding_name];
			}
		}
		//ない場合はnullを返す
		return null;
	}
}

MetaDataController.prototype.rename = function(uri, newName) {
	var src = this.get(uri);
	var uri_array = uri.split('.');
	uri_array.pop();
	var parent = this.get(uri_array.join('.'));
	if(src.meta == 'C') {
		if(parent.content.classes.hasOwnProperty(newName)) {
			//変更後の名前が既に存在
			return;
		}
		parent.content.classes[newName] = src;
		delete parent.content.classes[src.name];
	}else{
		if(parent.nestingPackages.hasOwnProperty(newName)) {
			//変更後の名前が既に存在
			return;
		}
		parent.nestingPackages[newName] = src;
		delete parent.nestingPackages[src.name];
	}
	console.log(this.meta_structure);
	//TODO : gmmeを変えないと
	parent.content.gmme[newName] = parent.content.gmme[src.name];
	delete parent.content.gmme[src.name];
	src.name = newName;
}

/**
 * 
 */
MetaDataController.prototype.addPackage = function(uri, name, type, no) {
	console.log('MetaModelController::addPackage(' + uri + ',' + name + ',' + type + ')');
	var parentPackage = this.get(uri);
	var newPackage = null;
	if(parentPackage != null) {
		if(parentPackage.nestingPackages.hasOwnProperty(name)) {
			//同じ名前がある場合
			if(no == undefined) no = 0;
			no++;
			newPackage = this.addPackage(uri, name + '_' + no, type, no);
		}else{
			newPackage = new MetaStructure.Package(name, uri, type, {});
			parentPackage.nestingPackages[name] = newPackage;
		}
	}
	return newPackage;
}

/**
 * 
 */
MetaDataController.prototype.delPackage = function(uri) {
	ps = uri.split('.');
	if(ps.length < 2) return false;
	var n = uri.lastIndexOf('.');
	var package_name = uri.substring(n + 1);
	var parent_name = uri.substring(0, n);
	console.log(package_name + ':' + parent_name);
	var parent = this.get(parent_name);
	delete parent.nestingPackages[package_name];
}

/**
 * 
 */
MetaDataController.prototype.updatePackage = function(uri) {
	this.getPackage(uri).content = content;
}

MetaDataController.prototype.check_modified_flg = function(uri) {
	this.getPackage(uri).modified_after_commit = true;
}

MetaDataController.prototype.addClass = function(uri, name, no) {
	var parentPackage = this.get(uri);
	var newClass = null;
	if(parentPackage != null) {
		if(parentPackage.content.classes.hasOwnProperty(name)) {
			//同じ名前がある場合
			if(no == undefined) no = 0;
			no++;
			newClass = this.addClass(uri, name + '_' + no, no);
		}else{
			newClass = new MetaStructure.Class(name, parentPackage.parent_uri + '.' + parentPackage.name);
			parentPackage.content.classes[name] = newClass
		}
	}
	return newClass;
}

MetaDataController.prototype.addAssociation = function(uri, name) {
	var parentClass = this.get(uri);
	if(parentClass != null) {
		parentClass.associations[name] = new MetaStructure.Association(name, uri);
	}
}

MetaDataController.prototype.addProperty = function(uri, name) {
	var parentClass = this.get(uri);
	if(parentClass != null) {
		parentClass.properties[name] = new MetaStructure.Association(name, uri);
	}
}


MetaDataController.prototype.add = function(uri, element) {
	var parentPackage = this.get(uri);
	if(parentPackage != null) {
		switch(element.meta) {
		case 'C':
			parentPackage.content.classes[element.name] = element;
			break;
		case 'A':
			parentPackage.content.associations[element.name] = element;
			break;
		}
	}
}

MetaDataController.prototype.del = function(uri) {
	uris = uri.split('.');
	var name = uris.pop();
	var parentPackage = this.get(uris.join('.'));
	var targetElement = this.get(uri);
	if(parentPackage != null) {
		if(targetElement.meta == 'C') {
			delete parentPackage.content.classes[name];
		}else if(targetElement.meta == 'A') {
			delete parentPackage.content.associations[name];
		}else{
			delete parentPackage.nestingPackages[name];
		}
	}
}

/*
 * sample generator
 */
MetaDataController.prototype.sample = function() {
	
}

/*
 * sample generator
 */
MetaDataController.prototype.sampleSTM = function() {
	var toolkey = g_toolinfo.toolkey;
	this.meta_structure = new MetaStructure();
	
	//stm
	this.addPackage(toolkey, 'stm', 'dsml');
	//stm.StateDiagram
	this.addClass(toolkey+'.stm', 'StateDiagram');
	this.set(toolkey + '.stm.StateDiagram', 'abstract', false);
	this.set(toolkey + '.stm.StateDiagram', 'interface', false);
	//State
	this.addClass(toolkey+'.stm', 'State');
	//Transition
	this.addClass(toolkey+'.stm', 'Transition');
	
	//stm.StateDiagram.statesの設定
	this.addAssociation(toolkey + '.stm.StateDiagram', 'states');
	this.set(toolkey + '.stm.StateDiagram.states', 'etype', toolkey + '.stm.State');
	this.set(toolkey + '.stm.StateDiagram.states', 'containment', true);
	this.set(toolkey + '.stm.StateDiagram.states', 'lower', 0);
	this.set(toolkey + '.stm.StateDiagram.states', 'upper', -1);
	
	//stm.State.srcTransitionsの設定
	this.addAssociation(toolkey + '.stm.State', 'srcTransition');
	this.set(toolkey + '.stm.State.srcTransition', 'etype', toolkey + '.stm.Transition');
	this.set(toolkey + '.stm.State.srcTransition', 'containment', true);
	this.set(toolkey + '.stm.State.srcTransition', 'lower', 0);
	this.set(toolkey + '.stm.State.srcTransition', 'upper', -1);
	
	//stm.Transition.srcの設定
	this.addAssociation(toolkey + '.stm.Transition', 'src');
	this.set(toolkey + '.stm.Transition.src', 'etype', toolkey + '.stm.State');
	this.set(toolkey + '.stm.Transition.src', 'containment', false);
	this.set(toolkey + '.stm.Transition.src', 'lower', 0);
	this.set(toolkey + '.stm.Transition.src', 'upper', 1);
	
	//stm.Transition.destの設定
	this.addAssociation(toolkey + '.stm.Transition', 'dest');
	this.set(toolkey + '.stm.Transition.dest', 'etype', toolkey + '.stm.State');
	this.set(toolkey + '.stm.Transition.dest', 'containment', false);
	this.set(toolkey + '.stm.Transition.dest', 'lower', 0);
	this.set(toolkey + '.stm.Transition.dest', 'upper', 1);
	
	//stm.State.nameの設定
	this.addProperty(toolkey + '.stm.State', 'name');
	this.set(toolkey + '.stm.State.name', 'etype', 'String');
	this.set(toolkey + '.stm.State.name', 'isID', false);
	this.set(toolkey + '.stm.State.name', 'lower', 0);
	this.set(toolkey + '.stm.State.name', 'upper', 1);
	this.set(toolkey + '.stm.State.name', 'default_value', '');
	
	//notationを設定
	this.get(toolkey + '.stm.State').notation = toolkey + '.stm.State';
	
	console.log(this.get(toolkey + '.stm').name);
	console.log(this.get(toolkey + '.stm.StateDiagram').name);
	console.log(this.get(toolkey + '.stm.State').name);
	console.log(this.get(toolkey + '.stm.Transition').name);
}
