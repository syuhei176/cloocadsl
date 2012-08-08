/**
 * 2012/8/4
 * ケロロ軍曹のエンディング曲は、「くっつけはっつけワンダーランド」http://www.youtube.com/watch?v=G2otDemqEFg
 * @returns
 */
function ToolController() {
	var tools = {};
	return {
		getlist : function() {
			return tools;
		},
		add : function(key, n) {
			tools[key] = n;
		},
		del : function(key) {
			delete tools[key];
		},
		get : function(key) {
			return tools[key];
		}
	}
}

function Tool(name, uri, attr_name) {
	this.name = name;
	this.uri = uri;
	this.attr_name = attr_name;
}