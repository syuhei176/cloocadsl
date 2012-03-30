function Model() {
	this.id = 1;
	this.root = null;
}

function Diagram() {
	this.id = 1;
	this.objects = new Array();
	this.relationships = new Array();
}

function Object() {
	this.meta_id = 1;
	this.id = 1;
	this.x = 50;
	this.y = 50;
	this.width = 50;
	this.height = 50;
}

function Relationship() {
	this.meta_id = 1;
	this.id = 1;
	this.src = null;
	this.dest = null;
	this.points = new Array();
}

function VersionElement() {
	this.version = 0;
	this.ver_type = "none";
}

function MetaModel() {
	this.version = 0;
	this.ver_type = "none";
}

function MetaDiagram() {
	this.version = 0;
	this.ver_type = "none";
}


function MetaObject() {
	this.version = 0;
	this.ver_type = "none";
}

function MetaRelationship() {
	this.version = 0;
	this.ver_type = "none";
}

function Binding() {
	this.src = null;
	this.dest = null;
}


function getObject(id) {
	
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

var idcount = 0;

function getNewId() {
	idcount++;
	return idcount;
}
