function PreviewManager(wb) {
	this.wb = wb;
}


PreviewManager.prototype.init = function() {
	/*
	 * モデルコントローラを用意
	 * ダイアグラムを指定
	 */
	var controllers = SampleGenerator.createSTMSample();
	var modelController = new ModelController(controllers.metaModelController);
	var EModel = controllers.metaModelController.get('sample.stm.StateDiagram');
	modelController.addPackage('root', 'test');
	var InstanceOfStateDiagram = modelController.newClass('root.test', EModel/*, controllers.notationController.get('sample.stm.StateDiagram')*/);
	var notationOfStateDiagram = {
			meta_uri : 'notation.state-diagram',
			nodes : {},
			connections : {},
			labels : {}
		};
	modelController.get('root.test').editors[InstanceOfStateDiagram.id] = notationOfStateDiagram;
	var deditor = new DiagramEditor('preview','preview', InstanceOfStateDiagram, modelController, controllers.metaModelController, controllers.notationController, controllers.toolController, this.wb, notationOfStateDiagram, 'root.test');
	this.wb.editorTabPanel.add(deditor, 'preview');
}


PreviewManager.prototype.run = function() {
	
}
