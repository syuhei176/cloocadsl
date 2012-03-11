package com.clooca.core.client.model.gopr.metaelement;

import java.util.List;

import com.clooca.core.client.model.gopr.element.ModelElement;
import com.clooca.core.client.model.gopr.element.Property;
import com.clooca.core.client.model.gopr.element.VersionElement;

public class MetaProperty {
	
	public int id;
	public String name;
	public VersionElement ve = new VersionElement();
	
	/**
	 * String (e.g. name of a state)
	 * Number (e.g. thread of execution of message)
	 * Boolean (e.g. primary key?)
	 * Text (e.g. documentation field)
	 * Creation Timestamp (the time the property was created – essentially the creation time of the non-property the property belongs to)
	 * Collection of items (e.g. attributes of a class)
	 * Non-property (e.g. an attribute in an attribute list of a class may itself be an object).
	 */
	public String data_type;
	
	public static final String STRING = "string";
	public static final String NUMBER = "number";
	public static final String COLLECTION = "collection";
	
	/**
	 * Input Field: a normal one-line text entry field (the default).
	 * Fixed List: a pull-down list of values: only values in the list are allowed.
	 * Overridable List: a pull-down list of values: the user can also type a value which is not in the list.
	 * Editable List: a pull-down list of values: the user can also type a value which is not in the list. Such new values are added to the list for this property type in this project.
	 * External Element: a one-line text entry field, whose values are intended to refer to external resources like file names or URLs. These external files can be opened with the Execute command from the widget’s pop-up menu.
	 * SOAP Fixed List: a pull-down list of values that has been fetched from an external source via a SOAP call.
	 * Radio Button Set: a list of values that will appear as a set of radio buttons.
	 */
	public String widget;
	
	public static final String INPUT_FIELD = "input field";
	public static final String FIXED_LIST = "fixed list";
	
	public MetaProperty() {
	}

	public MetaProperty(int id, String name, String data_type, String widget) {
		this.name = name;
		this.data_type = data_type;
		this.widget = widget;
	}
	
	public String getName() {
		return name;
	}
	
	public String getDataType() {
		return data_type;
	}
	
}
