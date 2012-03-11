package com.clooca.core.client.workbench.view;

import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.ListBox;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.event.dom.client.ClickEvent;

public class PropertySettingPanel extends Composite {

	private static PropertySettingPanelUiBinder uiBinder = GWT
			.create(PropertySettingPanelUiBinder.class);
	@UiField TextBox propertyName;
	@UiField TextBox parentName;
	@UiField ListBox data_type;
	@UiField ListBox widget;
	@UiField Button ok;
	@UiField Button cancel;
	MetaProperty metaproperty;
	
	interface PropertySettingPanelUiBinder extends
			UiBinder<Widget, PropertySettingPanel> {
	}

	public PropertySettingPanel(MetaProperty metaproperty) {
		initWidget(uiBinder.createAndBindUi(this));
		this.metaproperty = metaproperty;
		data_type.addItem(MetaProperty.STRING);
		data_type.addItem(MetaProperty.NUMBER);
		data_type.addItem(MetaProperty.COLLECTION);
		widget.addItem(MetaProperty.INPUT_FIELD);
		widget.addItem(MetaProperty.FIXED_LIST);
	}

	@UiHandler("ok")
	void onOkClick(ClickEvent event) {
		metaproperty.name = propertyName.getText();
		metaproperty.data_type = data_type.getItemText(data_type.getSelectedIndex());
		metaproperty.widget = widget.getItemText(widget.getSelectedIndex());
	}
}
