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

/**
 * Meta Model
 */
function MetaModel(id, name, metadiagram) {
	this.id = id;
	this.name = name;
	this.metadiagram = metadiagram;
}

function MetaDiagram(id, name) {
	this.id = id;
	this.name = name;
	this.metaobjects = new Array();
	this.metarelations = new Array();
}

function MetaObject(id, name) {
	this.id = id;
	this.name = name;
	this.properties = new Array();
	this.abstractable = false;
	this.graphic = null;
}

function MetaRelation(id, name) {
	this.id = id;
	this.name = name;
	this.properties = new Array();
	this.bindings = new Array();
	this.arrow_type = "none";
}

function Binding(src, dest, parent) {
	this.src = src;
	this.dest = dest;
	this.parent = parent;
}

function MetaProperty(id, name) {
	this.id = id;
	this.name = name;
	/**
	 * String (e.g. name of a state)
	 * Number (e.g. thread of execution of message)
	 * Boolean (e.g. primary key?)
	 * Text (e.g. documentation field)
	 * Creation Timestamp (the time the property was created – essentially the creation time of the non-property the property belongs to)
	 * Collection of items (e.g. attributes of a class)
	 * Non-property (e.g. an attribute in an attribute list of a class may itself be an object).
	 */
	this.data_type = "String";
	
	/**
	 * Input Field: a normal one-line text entry field (the default).
	 * Fixed List: a pull-down list of values: only values in the list are allowed.
	 * Overridable List: a pull-down list of values: the user can also type a value which is not in the list.
	 * Editable List: a pull-down list of values: the user can also type a value which is not in the list. Such new values are added to the list for this property type in this project.
	 * External Element: a one-line text entry field, whose values are intended to refer to external resources like file names or URLs. These external files can be opened with the Execute command from the widget’s pop-up menu.
	 * SOAP Fixed List: a pull-down list of values that has been fetched from an external source via a SOAP call.
	 * Radio Button Set: a list of values that will appear as a set of radio buttons.
	 */
	this.widget = "input field";
	
	/**
	 * extended field
	 */
	this.exfield = "";
}

MetaProperty.STRING = "string";
MetaProperty.NUMBER = "number";
MetaProperty.COLLECTION = "collection";
MetaProperty.COLLECTION_STRING = "collection_String";

MetaProperty.INPUT_FIELD = "input field";
MetaProperty.FIXED_LIST = "fixed list";
