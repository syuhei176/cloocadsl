package com.clooca.core.client.workbench.view;


import com.clooca.core.client.model.gopr.metaelement.MetaModel;
import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
import com.clooca.core.client.model.gopr.metaelement.MetaRelation;
import com.clooca.core.client.util.ArrowHead;
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
import com.google.gwt.user.client.ui.IntegerBox;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.event.dom.client.ChangeEvent;

public class MetaRelationSettingPanel extends Composite {

	private static MetaRelationSettingPanelUiBinder uiBinder = GWT
			.create(MetaRelationSettingPanelUiBinder.class);
	@UiField ListBox properties;
	@UiField Button add;
	@UiField Button delete;
	@UiField IntegerBox idbox;
	@UiField TextBox name;
	@UiField Button update;
	@UiField ListBox arrowBox;
	MetaRelation metaRel;
	MetaModel metamodel;
	
	interface MetaRelationSettingPanelUiBinder extends
			UiBinder<Widget, MetaRelationSettingPanel> {
	}

	public MetaRelationSettingPanel(MetaRelation metaRel, MetaModel metamodel) {
		initWidget(uiBinder.createAndBindUi(this));
		this.metaRel = metaRel;
		idbox.setValue(this.metaRel.id);
		name.setText(this.metaRel.name);
		for(MetaProperty mp : metaRel.properties) {
			properties.addItem(mp.name);
		}
		arrowBox.addItem(ArrowHead.NONE);
		arrowBox.addItem(ArrowHead.V);
		arrowBox.addItem(ArrowHead.TRIANGLE);
		arrowBox.addItem(ArrowHead.BLACK_TRIANGLE);
		arrowBox.addItem(ArrowHead.DIAMOND);
		arrowBox.addItem(ArrowHead.BLACK_DIAMOND);
		for(int i=0;i < arrowBox.getItemCount();i++) {
			if(arrowBox.getItemText(i).matches(metaRel.arrow_type)) arrowBox.setSelectedIndex(i);
		}
	}

	@UiHandler("add")
	void onAddClick(ClickEvent event) {
		final MetaProperty new_metaprop = new MetaProperty();
		SimpleDialogBox db = new SimpleDialogBox(new PropertySettingPanel(new_metaprop, metamodel), "setting");
		db.show();
		db.center();
		db.addCloseHandler(new CloseHandler(){

			@Override
			public void onClose(CloseEvent event) {
				properties.addItem(new_metaprop.name);
				new_metaprop.id = IdGenerator.getNewLongId();
				metaRel.properties.add(new_metaprop);
			}});
	}
	
	@UiHandler("delete")
	void onDeleteClick(ClickEvent event) {
//		properties.getItemText(properties.getSelectedIndex());
		metaRel.properties.remove(properties.getSelectedIndex());
		properties.removeItem(properties.getSelectedIndex());
	}
	
	@UiHandler("idbox")
	void onIdboxChange(ChangeEvent event) {
		if(Window.confirm("メタオブジェクトのidを変更するとインスタンスが壊れる可能性があります。")) {
			this.metaRel.id = idbox.getValue();
		}else{
			idbox.setValue(this.metaRel.id);
		}
	}
	
	@UiHandler("name")
	void onNameChange(ChangeEvent event) {
		this.metaRel.name = name.getText();
	}
	
	@UiHandler("update")
	void onUpdateClick(ClickEvent event) {
		SimpleDialogBox db = new SimpleDialogBox(new PropertySettingPanel(metaRel.properties.get(properties.getSelectedIndex()), metamodel), "setting");
		db.show();
		db.center();
		db.addCloseHandler(new CloseHandler(){

			@Override
			public void onClose(CloseEvent event) {
			}});
	}
	
	@UiHandler("arrowBox")
	void onArrowBoxChange(ChangeEvent event) {
		this.metaRel.arrow_type = arrowBox.getItemText(arrowBox.getSelectedIndex());
	}
}
