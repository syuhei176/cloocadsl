/**
 * モデルの表現
 * @returns
 */
function Model() {
	this.id = 1;
	//ルートダイアグラムへの参照
	this.root = 1;
	this.current_version = 1;
	//Diagramの実態
	this.diagrams = {}
	//Objectの実態
	this.objects = {}
	//Propertyの実態
	this.properties = {}
	//Relationshipの実態
	this.relationships = {}
}

function Diagram(meta_id) {
	this.id = 1;
	this.meta_id = meta_id;
	//Objectへの参照
	this.objects = new Array();
	//Relationshipへの参照
	this.relationships = new Array();
	this.ve = new VersionElement();
}

function Object(meta_id) {
	this.meta_id = meta_id;
	this.id = object_IdGenerator.getNewId();
	this.bound = new Rectangle2D(50, 50, 50, 50);
	this.properties = new Array();	//*注意：PropertyListのリストです、Propertyのリストじゃない
	this.ve = new VersionElement();
}

function Relationship(meta_id) {
	this.meta_id = meta_id;
	this.id = object_IdGenerator.getNewId();
	this.src = null;
	this.dest = null;
	this.points = new Array();
	this.properties = new Array();	//*注意：PropertyListのリストです、Propertyのリストじゃない
	this.ve = new VersionElement();
}

function PropertyList() {
	this.meta_id = null;
	//Propertyへの参照
	this.children = new Array();
}

function Property() {
	this.id = property_IdGenerator.getNewId();
//	this.values = new Array();
	this.value = '';
	this.ve = new VersionElement();
}

function VersionElement() {
	this.version = 1;
	this.ver_type = "add";
}

VersionElement.update = function(ve) {
	if(ve.ver_type != 'add') ve.ver_type = 'update';
}

function ModelController() {}
ModelController.getObject = function(diagram, id) {
	return g_model.objects[id];
}

function MetaModelController(){}
MetaModelController.getMetaObject = function(metadiagram, id) {
	return g_metamodel.metaobjects[id];
}

MetaModelController.getMetaRelation = function(metadiagram, id) {
	return g_metamodel.metarelations[id];
}


function create_sample() {
	d = new Diagram();
	obj1 = new Object();
	obj1.id = 1;
	obj1.x = 50;
	d.objects.push(obj1);
	
	obj2 = new Object();
	obj2.id = 2;
	obj2.x = 50;
	d.objects.push(obj2);
	
	rel = new Relationship();
	rel.id = 2;
	rel.src = obj1;
	rel.dest = obj2;
	d.relationships.push(rel);
	return d;
}

function IdGenerator() {
	this.idcount = 0;
}

IdGenerator.prototype.setOffset = function(offset) {
	if(this.idcount < offset) {
		this.idcount = offset;
		console.log('offset='+this.idcount);
	}
}

IdGenerator.prototype.getNewId = function() {
	this.idcount++;
	return this.idcount;
}

var object_IdGenerator = new IdGenerator();
var property_IdGenerator = new IdGenerator();
var metaobject_IdGenerator = new IdGenerator();
var metarelation_IdGenerator = new IdGenerator();
