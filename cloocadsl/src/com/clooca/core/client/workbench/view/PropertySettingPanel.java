package com.clooca.core.client.workbench.view;

import com.clooca.core.client.listener.MySelectionListener;
import com.clooca.core.client.model.gopr.metaelement.MetaModel;
import com.clooca.core.client.model.gopr.metaelement.MetaObject;
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
import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.AbsolutePanel;

public class PropertySettingPanel extends Composite {

	private static PropertySettingPanelUiBinder uiBinder = GWT
			.create(PropertySettingPanelUiBinder.class);
	@UiField TextBox propertyName;
	@UiField TextBox parentName;
	@UiField ListBox data_type;
	@UiField ListBox widget;
	@UiField TextArea exfield;
	@UiField TextBox collectionType;
	@UiField AbsolutePanel collectionTypePanel;
	@UiField Button collectionTypeButton;
	MetaProperty metaproperty;
	MetaModel metamodel;
	
	interface PropertySettingPanelUiBinder extends
			UiBinder<Widget, PropertySettingPanel> {
	}

	public PropertySettingPanel(MetaProperty metaproperty, MetaModel metamodel) {
		initWidget(uiBinder.createAndBindUi(this));
		this.metaproperty = metaproperty;
		this.metamodel = metamodel;
		data_type.addItem(MetaProperty.STRING);
		data_type.addItem(MetaProperty.NUMBER);
		data_type.addItem(MetaProperty.COLLECTION);
		widget.addItem(MetaProperty.INPUT_FIELD);
		widget.addItem(MetaProperty.FIXED_LIST);
		propertyName.setText(metaproperty.name);
		for(int i=0;i < data_type.getItemCount();i++) {
			if(data_type.getItemText(i).matches(metaproperty.data_type)) {
				data_type.setSelectedIndex(i);
			}
		}
		for(int i=0;i < widget.getItemCount();i++) {
			if(widget.getItemText(i).matches(metaproperty.widget)) {
				widget.setSelectedIndex(i);
			}
		}
		exfield.setText(metaproperty.exfield);
		if(metaproperty.collection_type != null) collectionType.setText(metaproperty.collection_type.getName());
	}
	
	@UiHandler("propertyName")
	void onPropertyNameChange(ChangeEvent event) {
		metaproperty.name = propertyName.getText();
	}
	
	@UiHandler("data_type")
	void onData_typeChange(ChangeEvent event) {
		metaproperty.data_type = data_type.getItemText(data_type.getSelectedIndex());
		if(metaproperty.data_type.matches(MetaProperty.COLLECTION)) {
			this.collectionTypePanel.setVisible(true);
		}else{
			this.collectionTypePanel.setVisible(false);
		}
	}
	
	@UiHandler("widget")
	void onWidgetChange(ChangeEvent event) {
		metaproperty.widget = widget.getItemText(widget.getSelectedIndex());
	}
	
	@UiHandler("exfield")
	void onExfieldChange(ChangeEvent event) {
		metaproperty.exfield = exfield.getText();
	}
	
	@UiHandler("collectionTypeButton")
	void onCollectionTypeButtonClick(ClickEvent event) {
		MetaObjectSelectionPanel d = new MetaObjectSelectionPanel(metamodel, new MySelectionListener(){

			@Override
			public void onSelection(Object value) {
				metaproperty.collection_type = (MetaObject)value;
			}});
		d.center();
		d.show();
	}
}
