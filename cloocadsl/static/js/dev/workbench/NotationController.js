/*
 * notationに親子関係を持たせねば
 */

/**
 * 
 */
function NotationController() {
	var members = {};
	var root = {children:{}};
	function get_part(elem, uri_array) {
		if(!elem.children.hasOwnProperty(uri_array[0])) {
			//Exception
			console.log('NotationController::get_part('+uri_array.length+') Exception!');
		}
		elem = elem.children[uri_array[0]];
		if(uri_array.length == 1) {
			return elem;
		}else{
			uri_array.shift();
			return get_part(elem, uri_array)
		}
	}
	return {
		getRoot : function() {
			return root;
		},
		get : function(uri) {
			console.log('get(' + uri);
			var uri_array1 = uri.split('.');
//			console.log(uri_array1);
			if(uri_array1[0] == 'notation') {
				uri_array1.shift();
				return get_part(root, uri_array1);
			}else{
				return get_part(root, uri_array1);
			}
		},
		add : function(target_uri, n) {
			n.target_uri = target_uri;
			members[target_uri] = n;
		},
		addRoot : function(name, n) {
			root.children[name] = n;
		},
		addChild : function(uri, name, n) {
			var parent = this.get(uri);
			if(parent == undefined) {
				this.addRoot(name, n);
				return true;
			}
			if(parent.children.hasOwnProperty(name)) {
				//Exception
				return false;
			}else{
				n.uri = uri + '.' + name;
				this.get(uri).children[name] = n;
				return true;
			}
		},
		setProperty : function(uri, key, value) {
			this.get(uri).props[key] = value;
		},
		getPropertyKeys : function(uri) {
			return this.get(uri).props;
		},
		getProperty : function(uri, key) {
			this.get(uri).props[key];
		},
		del : function(uri) {
			ps = uri.split('.');
			if(ps.length < 2) return false;
			var n = uri.lastIndexOf('.');
			var name = uri.substring(n + 1);
			var parent_uri = uri.substring(0, n);
			delete this.get(parent_uri).children[name];
		}
	}
}

/**
 * @param target_uri
 * @returns
 * 
 * graph_element_type
 * 'diagram' : ダイアグラム
 * 'node' : ノード
 * 'connection' : エッジ
 * 'label' : ラベル
 * 
 * shape
 * 'rect' : 四角形
 * 'rounded' : 角丸
 * 'circle' : 丸
 * 'user defined' : ユーザ定義
 * '-' : 線
 * '<-' : 線＋矢印
 * '->' : 線＋矢印
 * '->>' : 線＋矢印
 * '->>>' : 線＋矢印
 * '->>>>' : 線＋矢印
 * '-)' : 線＋矢印
 */
function DiagramNotation(option) {
	this.target_uri = option.target_uri;
	this.children = {};
	if(option.gtype == undefined) {
		this.gtype = 'node';
	}else{
		this.gtype = option.gtype;
	}
	this.props = {};
	switch(this.gtype) {
	case 'node':
		if(option.shape == undefined) {
			this.shape = 'rect';
		}else{
			this.shape = option.shape;
		}
		this.props.userdefined_shape = {};
		this.containmentFeature = null;
		this.childrenFeature = null;
		this.labels = [];
		break;
	case 'connection':
		this.containmentFeature = null;
		this.sourceFeature = null;
		this.targetFeature = null;
		this.diagramLink = null;
		break;
	case 'diagram':
		break;
	case 'label':
		break;
	}
}

/*
{
 diagram:{
   name : "State Diagram",
   target_uri : "",
   nodes : [{
     name : "State",
     target_uri : ""
   },{
     target_uri : ""
   }],
   connection : [{
     target_uri : ""
   }],
   labels : [{
     target_uri : ""
   },{
     target_uri : ""
   }]
 }
}
*/
