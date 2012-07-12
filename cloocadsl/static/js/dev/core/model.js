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
	this.user_id = g_userinfo.id;
	this.id = diagram_IdGenerator.getNewId();
	this.project_id = g_projectinfo.id;
	this.meta_id = meta_id;
	this.properties = new Array();	//*注意：PropertyListのリストです、Propertyのリストじゃない
	//Objectへの参照
	this.objects = new Array();
	//Relationshipへの参照
	this.relationships = new Array();
	this.ve = new VersionElement();
}

function Object(meta_id) {
	this.meta_id = meta_id;
	this.user_id = g_userinfo.id;
	this.id = object_IdGenerator.getNewId();
	this.project_id = g_projectinfo.id;
	this.bound = new Rectangle2D(50, 50, 50, 50);
	this.properties = new Array();	//*注意：PropertyListのリストです、Propertyのリストじゃない
	this.ve = new VersionElement();
	this.diagram = null;
	this.ofd = new ObjectForDiagram();
}

function ObjectForDiagram() {
	this.z = 0;
}

function Relationship(meta_id) {
	this.meta_id = meta_id;
	this.user_id = g_userinfo.id;
	this.id = object_IdGenerator.getNewId();
	this.project_id = g_projectinfo.id;
	this.src = null;
	this.dest = null;
	this.points = new Array();
	this.properties = new Array();	//*注意：PropertyListのリストです、Propertyのリストじゃない
	this.ve = new VersionElement();
	this.rfd = new RelationshipForDiagram();
}

function RelationshipForDiagram() {
	this.z = 0;
}

function PropertyList() {
	this.meta_id = null;
	//Propertyへの参照
	this.children = new Array();
}

function Property() {
	this.user_id = g_userinfo.id;
	this.id = property_IdGenerator.getNewId();
	this.project_id = g_projectinfo.id;
//	this.values = new Array();
	this.meta_id = null;
	this.value = '';
	this.ve = new VersionElement();
}

function VersionElement() {
	this.version = 1;
	this.ver_type = "add";
	this.a = 0;
}

VersionElement.update = function(ve) {
	if(ve.ver_type != 'add') ve.ver_type = 'update';
}

function MetaModelController(){}
MetaModelController.getMetaObject = function(metadiagram, id) {
	return g_metamodel.metaobjects[id];
}

MetaModelController.getMetaRelation = function(metadiagram, id) {
	return g_metamodel.metarelations[id];
}

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

var diagram_IdGenerator = new IdGenerator();
var object_IdGenerator = new IdGenerator();
var property_IdGenerator = new IdGenerator();
