function ModelController(ctool) {
	this.model = new Model();
	/*
	 * json構造のため、Modelは直接MetaModelを持てない
	 * →モデルコントローラにメタモデルコントローラを持たせる
	 */
	this.ctool = ctool;
	//this.model._sys_meta = this.ctool.getRootClass().id;
	this.model = this.ctool.getRootClass().getInstance();
}

ModelController.prototype.setCtool = function(ctool) {
	this.ctool = ctool;
}

ModelController.prototype.getModel = function() {
	return this.model;
}

/**
 * @param uri : 
 * @param klass : 
 */
ModelController.prototype.add = function(uri, klass) {
	var parent = this.get(uri);
	var parentMetaClass = this.ctool.getClass(parent._sys_meta);
	var asso = parentMetaClass.getAssociation(klass);
	var instance = klass.getInstance();
	
	//instance._sys_name = 'a';
	/*
	var instance = {
			_sys_name:'a',
			_sys_meta:klass.id,
			_sys_uri:uri+'.'+'a'};
	*/
	if(asso.upper == 1) {
		parent[asso.name] = instance;
		instance._sys_uri = uri+'.'+asso.name;
	}else{
		this.get(uri)[asso.name][instance._sys_name] = instance;
		instance._sys_uri = uri + '.' + asso.name + '.' + instance._sys_name;
	}
	return instance;
}

ModelController.prototype.rename = function(uri, newName) {
	/*
	var o = this.get(uri);
	var parent = this.getParent(uri);
	delete parent[o._sys_name];
	o._sys_name = newName;
	parent[newName] = o;
	*/
}

ModelController.prototype.set = function(uri, attr, value) {
	this.get(uri)[attr] = value;
}

ModelController.prototype.getParent = function(uri) {
	var uri_array = uri.split('.');
	uri_array.pop();
	return this.get(uri_array.join('.'));
}


ModelController.prototype.get = function(uri) {
	if(uri == 'root') {
		return this.model;
	}
	var uri_array = uri.split('.');
	uri_array.shift();
	var current = this.model;
	for(var i=0;i < uri_array.length;i++) {
		current = current[uri_array[i]];
	}
	return current;
}

/*
ModelController.prototype.get = function(uri) {
//	console.log('ModelController::get(' + uri + ')');
	if(uri == 'root') {
		return this.model;
	}
	var uri_array = uri.split('.');
	uri_array.shift();
	return get_part1(this.model, uri_array);
	function get_part1(element, uri_array) {
		var elem = one_phase(element, uri_array[0])
		if(elem == null) return null;
		if(uri_array.length == 1) {
			return elem;
		}else{
			uri_array.shift();
			return get_part1(elem, uri_array);
		}
	}
	function one_phase(element, finding_name) {
		//elementがパッケージの場合
		if(element.meta == undefined || element.meta == 'P') {
			//elementの子パッケージを検索
			if(element.nestingPackages.hasOwnProperty(finding_name)) {
				return element.nestingPackages[finding_name]
			}
			//elementの子クラスを検索
			if(element.classes.hasOwnProperty(finding_name)) {
				return element.classes[finding_name];
			}
		}else if(element.meta == 'C') {
			//elementのpropsを検索
			if(element.props.hasOwnProperty(finding_name)) {
				return element.props[finding_name]
			}
			//elementのa_propsを検索
			if(element.a_props.hasOwnProperty(finding_name)) {
				return element.a_props[finding_name];
			}
			//elementのn_propsを検索
			if(element.n_props.hasOwnProperty(finding_name)) {
				return element.n_props[finding_name];
			}
		}
		//ない場合はnullを返す
		return null;
	}
}
*/

ModelController.prototype.delClass = function(uri) {
	ps = uri.split('.');
	if(ps.length < 2) return false;
	var n = uri.lastIndexOf('.');
	var name = uri.substring(n + 1);
	var parent_name = uri.substring(0, n);
	var parent = this.get(parent_name);
	//本体を消す
	delete parent.classes[name]
	//参照を消す
	for(var ckey in parent.classes) {
		var klass = parent.classes[ckey];
		for(var akey in klass.a_props) {
			var asso = klass.a_props[akey];
			if(asso == name) {
				delete klass.a_props[akey];
				break;
			}
			for(var key in asso) {
				if(asso[key] == name) {
					delete asso[key];
				}
			}
		}
	}
}

ModelController.prototype.addPackage = function(parent_uri, name) {
	this.get(parent_uri).nestingPackages[name] = new Model.Package(name);
}


ModelController.prototype.addClass = function(parent_uri, metaClass, notation) {
	var klass = this.newClass(parent_uri, metaClass, notation);
	this.get(parent_uri).classes[klass.id] = klass;
	return klass;
}

ModelController.prototype.newClass = function(parent_uri, metaClass, notation) {
	var meta_uri = metaClass.parent_uri + '.' + metaClass.name;
	var klass = new Model.Class(meta_uri);
	//プロパティをインスタンス化
	//TODO: generalizationも見る
	if(metaClass.generalization) {
		
	}
	for(var i=0;i < metaClass.properties.length;i++) {
		if(metaClass.properties[i].upper == 1) {
			if(metaClass.properties[i].type == 'Integer') {
				klass.props[metaClass.properties[i].name] = 0;
			}else if(metaClass.properties[i].type == 'String') {
				klass.props[metaClass.properties[i].name] = '';
			}else{
				klass.props[metaClass.properties[i].name] = {};
			}
		}else{
			klass.props[metaClass.properties[i].name] = [];
		}
	}
	createAssoInstance(metaClass);
	if(metaClass.superClass) {
		createAssoInstance(this.metaModelController.get(metaClass.superClass));
	}
	function createAssoInstance(metaClass) {
		for(var i in metaClass.associations) {
			if(metaClass.associations[i].upper == 1) {
				if(metaClass.associations[i].type == 'Integer') {
					klass.a_props[metaClass.associations[i].name] = 0;
				}else if(metaClass.associations[i].type == 'String') {
					klass.a_props[metaClass.associations[i].name] = '';
				}else{
					klass.a_props[metaClass.associations[i].name] = {};
				}
			}else{
				klass.a_props[metaClass.associations[i].name] = {}; //as array
			}
		}
	}
	//ノーテーション由来のプロパティをインスタンス化
	/*
	if(notation != undefined) {
		if(notation.graph_element_type == 'node') {
			klass.n_props.x = 0;
			klass.n_props.y = 0;
			klass.n_props.z = 0;
		}else if(notation.graph_element_type == 'connection') {
			klass.n_props.m1 = 0;
			klass.n_props.m2 = 0;
		}
	}
	*/
	//パッケージに作成したクラスを追加
	this.get(parent_uri).classes[klass.id] = klass;
	klass.parent_uri = parent_uri;
	return klass;
}

/**
 * @param src : model element
 * @param attr : src association
 * @param target : model element
 * make relationship between src and target
 */
ModelController.prototype.makeRelationship = function(src, attr, target) {
	var asso = null;
	var src_meta = this.metaModelController.get(src.meta_uri);
	console.log(src_meta);
	if(attr.indexOf('.') > 0) {
		attr_array = attr.split('.');
		attr = attr_array.pop();
		if(src.meta_uri == attr_array.join('.') || src_meta.superClass == attr_array.join('.')) {
			asso = this.metaModelController.get(src.meta_uri + '.' + attr);
			//srcのsuperClassのassoかもしれない
			if(asso == null) {
				asso = this.metaModelController.get(src_meta.superClass + '.' + attr);
			}
		}
	}else{
		asso = this.metaModelController.get(src.meta_uri + '.' + attr);
		//srcのsuperClassのassoかもしれない
		if(asso == null) {
			asso = this.metaModelController.get(this.metaModelController.get(src.meta_uri).superClass + '.' + attr);
		}
	}
	if(asso == null) return false;
	//console.log(asso.etype, target.meta_uri);
	
	//targetのsuperClassと比較
	if(asso.etype != target.meta_uri) {
		if(asso.etype != this.metaModelController.get(target.meta_uri).superClass) return false;
	}
	//console.log('asso=[');
	//console.log(asso);
	//console.log(']');
	if(asso.upper == -1 || asso.upper > 1) {
		src.a_props[asso.name][target.id] = target.id;
	}else{
		src.a_props[asso.name] = target.id;
	}
	return true;
}

/**
 * @param src : model element
 * @param target : model element
 * make relationship between src and target
 */
ModelController.prototype.makeRelationshipByHint = function(src, target, hint) {
	var srcMetaClass = this.metaModelController.get(src.meta_uri);
	makeRelationship_part(src, target, hint, srcMetaClass)
	if(srcMetaClass.generalization) {
		//TODO: generalizationも見る
		var gen = this.metaModelController.get(srcMetaClass.generalization);
		makeRelationship_part(src, target, hint, gen)
	}
	function makeRelationship_part(src, target, hint, srcMetaClass) {
		//srcとtargetのmetaModelControllerから関係を見つける
		for(key in srcMetaClass.associations) {
			var asso = srcMetaClass.associations[key];
			if(asso.etype == target.meta_uri) {
				//console.log(asso.parent_uri + '.' + asso.name + ',' + hint);
				if(asso.parent_uri + '.' + asso.name == hint) {
					if(asso.upper == -1 || asso.upper > 1) {
						src.a_props[asso.name][target.id] = target.id;
					}else{
						src.a_props[asso.name] = target.id;
					}
					break;
				}
			}
		}
	}
}

ModelController.prototype.getRelatedClasses = function(klass, option) {
	var nodes = [];
	for(var key in klass.a_props) {
		var props = klass.a_props[key];
		for(var props_key in props) {
			var node = this.get(klass.parent_uri + '.' + props[props_key]);
			nodes.push(node);
		}
	}
	return nodes;
}
