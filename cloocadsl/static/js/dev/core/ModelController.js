function ModelController(metaModelController) {
	this.model = new Model();
	/*
	 * json構造のため、Modelは直接MetaModelを持てない
	 * →モデルコントローラにメタモデルコントローラを持たせる
	 */
	this.metaModelController = metaModelController;
}

ModelController.prototype.get = function(uri) {
//	console.log('ModelController::get(' + uri + ')');
	if(uri == 'root') {
		return this.model;
	}
	var uri_array = uri.split('.');
	uri_array.shift();
	return get_part1(this.model, uri_array);
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
	for(var i in metaClass.associations) {
		if(metaClass.associations[i].upper == 1) {
			if(metaClass.associations[i].type == 'Integer') {
				klass.a_props[metaClass.associations[i].name] = 0;
			}else if(metaClass.properties[i].type == 'String') {
				klass.a_props[metaClass.associations[i].name] = '';
			}else{
				klass.a_props[metaClass.associations[i].name] = {};
			}
		}else{
			klass.a_props[metaClass.associations[i].name] = {}; //as array
		}
	}
	//ノーテーション由来のプロパティをインスタンス化
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
	//パッケージに作成したクラスを追加
	this.get(parent_uri).classes[klass.id] = klass;
	klass.parent_uri = parent_uri;
	return klass;
}

/**
 * @param src : model element
 * @param target : model element
 * make relationship between src and target
 */
ModelController.prototype.makeRelationship = function(src, target, hint) {
	//srcとtargetのmetaModelControllerから関係を見つける
	var srcMetaClass = this.metaModelController.get(src.meta_uri);
	for(key in srcMetaClass.associations) {
		var asso = srcMetaClass.associations[key];
		if(asso.etype == target.meta_uri) {
			console.log(asso.parent_uri + '.' + asso.name + ',' + hint);
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
