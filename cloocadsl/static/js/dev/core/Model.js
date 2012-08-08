model_idgen = new IdGenerator();

/**
 * モデルの表現
 * @returns
 */
function Model() {
	this.id = model_idgen.getNewId();
	this.current_version = 1;
	//Diagramの実態
	this.nestingPackages = {}
}

Model.Package = function(name) {
	this.id = model_idgen.getNewId();
	this.name = name;
	this.nestingPackages = {}
	this.classes = {}
//	this.associations = {}
}

Model.Class = function(meta_uri) {
	this.id = model_idgen.getNewId();
	this.meta_uri = meta_uri;
	this.properties = {};
}

Model.Association = function(meta_uri) {
	this.id = model_idgen.getNewId();
	this.meta_uri = meta_uri;
	this.properties = [];
}

Model.Property = function() {
	this.id = model_idgen.getNewId();
}
