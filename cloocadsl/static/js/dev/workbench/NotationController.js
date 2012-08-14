function NotationController() {
	var members = {};
	return {
		getlist : function() {
			return members;
		},
		add : function(target_uri, n) {
			n.target_uri = target_uri;
			members[target_uri] = n;
		},
		del : function(key) {
			delete members[key];
		},
		get : function(key) {
			return members[key];
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
function GraphicNotation(option) {
	this.target_uri = null;
	if(option.gtype == undefined) {
		this.graph_element_type = 'node';
	}else{
		this.graph_element_type = option.gtype;
	}
	switch(this.graph_element_type) {
	case 'node':
		if(option.shape == undefined) {
			this.shape = 'rect';
		}else{
			this.shape = option.shape;
		}
		this.userdefined_shape = {};
		this.containmentFeature = null;
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
	this.gtype = this.graph_element_type;
	//containmentFeature
	//sourceFeature
	//targetFeature
	//diagramLink
}