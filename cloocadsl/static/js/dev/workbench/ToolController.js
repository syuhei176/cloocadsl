/**
 * 2012/8/4
 * ケロロ軍曹のエンディング曲は、「くっつけはっつけワンダーランド」http://www.youtube.com/watch?v=G2otDemqEFg
 * @returns
 */
function ToolController() {
	this.tools = {};
}

ToolController.prototype.getList = function() {
	return [];
}


ToolController.prototype.addTool = function(key, t) {
	this.tools[key] = t;
}

ToolController.prototype.updateTool = function(key, t) {
	this.tools[key] = t;
}

ToolController.prototype.delTool = function(key) {
	delete tools[key];
}
