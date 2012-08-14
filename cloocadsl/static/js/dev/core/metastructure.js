function MetaStructure(toolkey) {
	this.nestingPackages = {};
	this.importingPackages = {};
	this.toolkey = toolkey;
}

MetaStructure.Package = function(name, uri, lang_type, nestingPackages, parentPackage) {
	this.name = name;
	this.parent_uri = uri;
	this.lang_type = lang_type;
	this.nestingPackages = nestingPackages;
	this.nestingType = {};
	this.modified_after_commit = true;
	if(this.lang_type == 'dsl') {
		this.content = '';
	}else{
		this.content = {classes:{}};
//		this.content = SampleGenerator.gen();
	}
}

/*
 * 言語構造
 */
function DSLClass() {
	
}

function DSLValue() {
	
}

function DSLConstant() {
	
}


/*
 * モデル構造
 */

MetaStructure.Class = function(name, parent_uri) {
	this.meta = 'C';
	this.name = name;
	this.parent_uri = parent_uri;
	this.properties = {};
	this.associations = {};
	this.generalization = [];
	this.superClass = '';
	this.notation = '';
}

MetaStructure.Association = function(name, parent_uri) {
	this.meta = 'A';
	this.name = name;
	this.parent_uri = parent_uri;
	this.properties = [];
	this.memberEnd = [];
	this.etype = null;
	this.containment = null;
	this.lower = null;
	this.upper = null;
}

MetaStructure.Property = function(name, type, lower, upper) {
	this.meta = 'P';
	this.name = name;
	this.properties = []
	this.type = type;
	if(upper == undefined) {
		this.upper = 1;
	}else{
		this.upper = upper;
	}
	if(lower == undefined) {
		this.lower = 1;
	}else{
		this.lower = lower;
	}
}

MetaStructure.Generalization = function() {
	//汎化先ClassのURI
	this.general = null;
}

/*
 * Version Element
 */
function VersionElement() {
	this.last_operation = 'none';
	this.current_version = 1;
}

