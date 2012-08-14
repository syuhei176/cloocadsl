function IdGenerator() {
	this.idcount = 0;
}

IdGenerator.prototype.setOffset = function(offset) {
	if(this.idcount < offset) {
		this.idcount = offset;
	}
}

IdGenerator.prototype.getNewId = function() {
	this.idcount++;
	return this.idcount;
}
