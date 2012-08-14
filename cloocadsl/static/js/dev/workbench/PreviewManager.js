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
	/*
	var metaModelController = new MetaDataController();
	metaModelController.sampleSTM();
	var notationController = new NotationController();
	notationController.add(g_toolinfo.toolkey + '.stm.StateDiagram', new GraphicNotation('diagram'));
	notationController.add(g_toolinfo.toolkey + '.stm.State', new GraphicNotation('node'));
	notationController.add(g_toolinfo.toolkey + '.stm.Transition', new GraphicNotation('connection', '-'));
	notationController.add(g_toolinfo.toolkey + '.stm.State.name', new GraphicNotation('label'));
	notationController.get(g_toolinfo.toolkey + '.stm.State').containmentFeature = g_toolinfo.toolkey + '.stm.StateDiagram.states';
	notationController.get(g_toolinfo.toolkey + '.stm.Transition').containmentFeature = g_toolinfo.toolkey + '.stm.State.srcTransition';
	notationController.get(g_toolinfo.toolkey + '.stm.Transition').targetFeature = g_toolinfo.toolkey + '.stm.Transition.dest';
	
	var toolController = new ToolController();
	toolController.add('State', new Tool('State', g_toolinfo.toolkey + '.stm.State', 'states'));
	toolController.add('Transition', new Tool('Transition', g_toolinfo.toolkey + '.stm.Transition'));
	*/
	var EModel = controllers.metaModelController.get('sample.stm.StateDiagram');
	modelController.addPackage('root', 'test');
	var InstanceOfStateDiagram = modelController.newClass('root.test', EModel, controllers.notationController.get('sample.stm.StateDiagram'));
	var deditor = new DiagramEditor('preview','preview', InstanceOfStateDiagram, modelController, controllers.metaModelController, controllers.notationController, controllers.toolController, this.wb);
	this.wb.editorTabPanel.add(deditor, 'preview');
}


PreviewManager.prototype.run = function() {
	
}
