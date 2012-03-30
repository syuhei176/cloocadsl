package com.clooca.core.client.workbench.view;

import com.clooca.core.client.model.gopr.metaelement.GraphicInfo;
import com.clooca.core.client.model.gopr.metaelement.MetaModel;
import com.clooca.core.client.model.gopr.metaelement.MetaObject;
import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
import com.clooca.core.client.util.IdGenerator;
import com.clooca.core.client.view.SimpleDialogBox;
import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.ListBox;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.logical.shared.CloseEvent;
import com.google.gwt.event.logical.shared.CloseHandler;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.user.client.ui.IntegerBox;

public class MetaObjectSettingPanel extends Composite {

	private static MetaObjectSettingPanelUiBinder uiBinder = GWT
			.create(MetaObjectSettingPanelUiBinder.class);
	@UiField ListBox properties;
	@UiField Button add;
	@UiField Button delete;
	@UiField TextBox name;
	@UiField IntegerBox idbox;
	@UiField Button update;
	@UiField ListBox graphicBox;
	MetaObject metaObj;
	MetaModel metamodel;
	
	interface MetaObjectSettingPanelUiBinder extends
			UiBinder<Widget, MetaObjectSettingPanel> {
	}

	public MetaObjectSettingPanel(MetaObject metaObj, MetaModel metamodel) {
		initWidget(uiBinder.createAndBindUi(this));
		this.metaObj = metaObj;
		this.metamodel = metamodel;
		name.setText(this.metaObj.name);
		idbox.setValue(this.metaObj.id);
		for(MetaProperty mp : metaObj.properties) {
			properties.addItem(mp.name);
		}
		graphicBox.addItem(GraphicInfo.RECT);
		graphicBox.addItem(GraphicInfo.ROUNDED);
		graphicBox.addItem(GraphicInfo.CIRCLE);
		for(int i=0;i < graphicBox.getItemCount();i++) {
			if(graphicBox.getItemText(i).matches(metaObj.graphic.shape)) graphicBox.setSelectedIndex(i);
		}
	}

	@UiHandler("add")
	void onAddClick(ClickEvent event) {
		/*
		 * insert meta property
		 */
		final MetaProperty new_metaprop = new MetaProperty();
		new_metaprop.id = IdGenerator.getNewLongId();
		new_metaprop.data_type = MetaProperty.STRING;
		new_metaprop.widget = MetaProperty.INPUT_FIELD;
		SimpleDialogBox db = new SimpleDialogBox(new PropertySettingPanel(new_metaprop, metamodel), "setting");
		db.show();
		db.center();
		db.addCloseHandler(new CloseHandler(){

			@Override
			public void onClose(CloseEvent event) {
				properties.addItem(new_metaprop.name);
				metaObj.properties.add(new_metaprop);
			}});
	}
	
	@UiHandler("delete")
	void onDeleteClick(ClickEvent event) {
//		properties.getItemText(properties.getSelectedIndex());
		metaObj.properties.remove(properties.getSelectedIndex());
		properties.removeItem(properties.getSelectedIndex());
	}
	
	@UiHandler("name")
	void onNameChange(ChangeEvent event) {
		this.metaObj.name = name.getText();
	}
	
	@UiHandler("idbox")
	void onIdboxChange(ChangeEvent event) {
		if(Window.confirm("メタオブジェクトのidを変更するとインスタンスが壊れる可能性があります。")) {
			this.metaObj.id = idbox.getValue();
		}else{
			idbox.setValue(this.metaObj.id);
		}
	}
	@UiHandler("update")
	void onUpdateClick(ClickEvent event) {
		SimpleDialogBox db = new SimpleDialogBox(new PropertySettingPanel(metaObj.properties.get(properties.getSelectedIndex()), metamodel), "setting");
		db.show();
		db.center();
		db.addCloseHandler(new CloseHandler(){

			@Override
			public void onClose(CloseEvent event) {
			}});
	}
	@UiHandler("graphicBox")
	void onGraphicBoxChange(ChangeEvent event) {
		this.metaObj.graphic.shape = this.graphicBox.getItemText(this.graphicBox.getSelectedIndex());
	}
}
