package com.clooca.core.client.workbench.view;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.model.gopr.metaelement.MetaDiagram;
import com.clooca.core.client.model.gopr.metaelement.MetaModel;
import com.clooca.core.client.model.gopr.metaelement.MetaObject;
import com.clooca.core.client.model.gopr.metaelement.MetaRelation;
import com.clooca.core.client.view.SimpleDialogBox;
import com.clooca.core.client.workbench.view.cell.MetaDiagramCell;
import com.clooca.core.client.workbench.view.cell.MetaObjectCell;
import com.clooca.core.client.workbench.view.cell.MetaRelationCell;
import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.cellview.client.CellList;
import com.google.gwt.view.client.SelectionChangeEvent;
import com.google.gwt.view.client.SingleSelectionModel;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.event.dom.client.ClickEvent;

public class MetaElementManager extends Composite {

	private static MetaElementManagerUiBinder uiBinder = GWT
			.create(MetaElementManagerUiBinder.class);
	
	@UiField(provided=true) CellList<MetaDiagram> diagramCellList = new CellList<MetaDiagram>(new MetaDiagramCell());
	@UiField(provided=true) CellList<MetaObject> objectCellList = new CellList<MetaObject>(new MetaObjectCell());
	@UiField(provided=true) CellList<MetaRelation> relationCellList = new CellList<MetaRelation>(new MetaRelationCell());
	@UiField Button editObj;
	@UiField Button addObj;
	@UiField Button delObj;
	@UiField Button editRel;
	@UiField Button addRel;
	@UiField Button delRel;

	interface MetaElementManagerUiBinder extends
			UiBinder<Widget, MetaElementManager> {
	}

	MetaModel metamodel;
	MetaDiagram selectedMetaDiagram;
	MetaObject selectedMetaObject;
	MetaRelation selectedMetaRelation;
	
	public MetaElementManager(MetaModel metamodel) {
		initWidget(uiBinder.createAndBindUi(this));
		this.metamodel = metamodel;
		List<MetaDiagram> diagrams = new ArrayList<MetaDiagram>();
		diagrams.add(this.metamodel.meta_diagram);
		diagramCellList.setRowData(0, diagrams);
		//SelectionModelの設定
        final SingleSelectionModel<MetaDiagram> diagramSelectionModel = new SingleSelectionModel<MetaDiagram>();
        diagramSelectionModel.addSelectionChangeHandler(new SelectionChangeEvent.Handler() {
          @Override
          public void onSelectionChange(SelectionChangeEvent event) {
        	  selectedMetaDiagram = diagramSelectionModel.getSelectedObject();
        	  objectCellList.setRowData(0, selectedMetaDiagram.meta_objects);
        	  relationCellList.setRowData(0, selectedMetaDiagram.meta_relations);
          }
        });
        final SingleSelectionModel<MetaObject> objectSelectionModel = new SingleSelectionModel<MetaObject>();
        final SingleSelectionModel<MetaRelation> relationSelectionModel = new SingleSelectionModel<MetaRelation>();
        objectSelectionModel.addSelectionChangeHandler(new SelectionChangeEvent.Handler() {
          @Override
          public void onSelectionChange(SelectionChangeEvent event) {
        	  selectedMetaObject = objectSelectionModel.getSelectedObject();
//        	  if(selectedMetaRelation != null) relationSelectionModel.setSelected(selectedMetaRelation, false);
          }
        });
        relationSelectionModel.addSelectionChangeHandler(new SelectionChangeEvent.Handler() {
          @Override
          public void onSelectionChange(SelectionChangeEvent event) {
        	  selectedMetaRelation = relationSelectionModel.getSelectedObject();
//        	  if(selectedMetaObject != null) objectSelectionModel.setSelected(selectedMetaObject, false);
          }
        });
        diagramCellList.setSelectionModel(diagramSelectionModel);
        objectCellList.setSelectionModel(objectSelectionModel);
        relationCellList.setSelectionModel(relationSelectionModel);
	}

	@UiHandler("editObj")
	void onEditObjClick(ClickEvent event) {
		  SimpleDialogBox db = new SimpleDialogBox(new MetaObjectSettingPanel(selectedMetaObject, metamodel), "MetaObject Setting");
		  db.show();
		  db.center();
	}
	
	@UiHandler("addObj")
	void onAddObjClick(ClickEvent event) {
		if(this.selectedMetaDiagram != null) {
			
		}
	}
	
	@UiHandler("delObj")
	void onDelObjClick(ClickEvent event) {
	}
	
	@UiHandler("editRel")
	void onEditRelClick(ClickEvent event) {
		  SimpleDialogBox db = new SimpleDialogBox(new MetaRelationSettingPanel(selectedMetaRelation, metamodel), "MetaObject Setting");
		  db.show();
		  db.center();
	}
	
	@UiHandler("addRel")
	void onAddRelClick(ClickEvent event) {
	}
	
	@UiHandler("delRel")
	void onDelRelClick(ClickEvent event) {
	}
}
