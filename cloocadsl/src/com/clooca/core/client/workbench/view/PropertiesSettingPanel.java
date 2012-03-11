package com.clooca.core.client.workbench.view;

import java.util.List;

import java.util.List;

import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
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

public class PropertiesSettingPanel extends Composite {

	private static PropertiesSettingPanelUiBinder uiBinder = GWT
			.create(PropertiesSettingPanelUiBinder.class);
	@UiField ListBox properties;
	@UiField Button add;
	@UiField Button delete;
	List<MetaProperty> metaprops;
	
	interface PropertiesSettingPanelUiBinder extends
			UiBinder<Widget, PropertiesSettingPanel> {
	}

	public PropertiesSettingPanel(List<MetaProperty> metaprops) {
		initWidget(uiBinder.createAndBindUi(this));
		this.metaprops = metaprops;
		for(MetaProperty mp : metaprops) {
			properties.addItem(mp.name);
		}
	}

	@UiHandler("add")
	void onAddClick(ClickEvent event) {
		final MetaProperty new_metaprop = new MetaProperty();
		SimpleDialogBox db = new SimpleDialogBox(new PropertySettingPanel(new_metaprop), "setting");
		db.show();
		db.center();
		db.addCloseHandler(new CloseHandler(){

			@Override
			public void onClose(CloseEvent event) {
				properties.addItem(new_metaprop.name);
				metaprops.add(new_metaprop);
			}});
	}
	
	@UiHandler("delete")
	void onDeleteClick(ClickEvent event) {
//		properties.getItemText(properties.getSelectedIndex());
		metaprops.remove(properties.getSelectedIndex());
		properties.removeItem(properties.getSelectedIndex());
	}
}
