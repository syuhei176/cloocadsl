/**
 * Meta Model
 */
function MetaModel(id, name, metadiagram) {
	this.id = id;
	this.name = name;
	this.metadiagram = metadiagram;
	this.metadiagrams = {};
	this.metaobjects = {};
	this.metarelations = {};
	this.metaproperties = {};
	this.graphics = {};
	this.tools = {};
}

function MetaDiagram(id, name) {
	this.id = metadiagram_IdGenerator.getNewId();
	this.name = name;
	this.metaobjects = new Array();
	this.metarelations = new Array();
	this.instance_name = null;
	this.properties = new Array();
}

function MetaObject(id, name) {
	this.classname = 'MetaObject';
	this.id = metaobject_IdGenerator.getNewId();
	this.name = name;
	this.properties = new Array();	//propertyへの参照
	this.abstractable = false;
	this.graphic = null;
//	this.graphic_option = null;
	this.decomposition = null;
	this.resizable = false;
}

function MetaRelation(id, name) {
	this.classname = 'MetaRelation';
	this.id = metarelation_IdGenerator.getNewId();
	this.name = name;
	this.properties = new Array();	//propertyへの参照
	this.bindings = new Array();
	this.arrow_type = "none";
}

function Binding(src, dest, parent) {
	this.src = src;
	this.dest = dest;
	this.parent = parent;
}

function MetaProperty(id, name) {
	this.id = metaproperty_IdGenerator.getNewId();
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
	 * for "fixed list" {disp,value}
	 */
	this.exfield = "";
}

MetaProperty.STRING = "string";
MetaProperty.NUMBER = "number";
MetaProperty.COLLECTION = "collection";
MetaProperty.COLLECTION_STRING = "collection_String";

MetaProperty.INPUT_FIELD = "input field";
MetaProperty.FIXED_LIST = "fixed list";

function GraphicInfo(type, option) {
	this.type = type;
	this.option = option;
	this.src = null;
}

GraphicInfo.TYPE_LINES = 'lines';
GraphicInfo.TYPE_POLYGON = 'polygon';
GraphicInfo.TYPE_SRC = 'src';

function ToolMapping() {
	this.id = null;
	this.parent = null;
	this.metaobject_id = null;
	this.icon_type = null;
	this.icon = null;
}
