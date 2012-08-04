function NotationController() {
	this.members = [];
}

NotationController.prototype.getlist = function() {
	return this.members;
}

NotationController.prototype.add = function(option) {
	this.members.push(option);
}

NotationController.prototype.del = function(key) {
	
}

NotationController.prototype.update = function(key, option) {
	
}