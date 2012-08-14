function SampleGenerator() {
}

SampleGenerator.createSTMSample = function() {
	var metaModelController = new MetaDataController();
	metaModelController.reset(new MetaStructure('sample'));
	var toolkey = metaModelController.meta_structure.toolkey;
	
	//stm
	metaModelController.addPackage(toolkey, 'stm', 'dsml');
	//stm.StateDiagram
	metaModelController.addClass(toolkey+'.stm', 'StateDiagram');
	metaModelController.set(toolkey + '.stm.StateDiagram', 'abstract', false);
	metaModelController.set(toolkey + '.stm.StateDiagram', 'interface', false);
	//State
	metaModelController.addClass(toolkey+'.stm', 'State');
	//Transition
	metaModelController.addClass(toolkey+'.stm', 'Transition');
	
	//stm.StateDiagram.statesの設定
	metaModelController.addAssociation(toolkey + '.stm.StateDiagram', 'states');
	metaModelController.set(toolkey + '.stm.StateDiagram.states', 'etype', toolkey + '.stm.State');
	metaModelController.set(toolkey + '.stm.StateDiagram.states', 'containment', true);
	metaModelController.set(toolkey + '.stm.StateDiagram.states', 'lower', 0);
	metaModelController.set(toolkey + '.stm.StateDiagram.states', 'upper', -1);
	
	//stm.State.srcTransitionsの設定
	metaModelController.addAssociation(toolkey + '.stm.State', 'srcTransition');
	metaModelController.set(toolkey + '.stm.State.srcTransition', 'etype', toolkey + '.stm.Transition');
	metaModelController.set(toolkey + '.stm.State.srcTransition', 'containment', true);
	metaModelController.set(toolkey + '.stm.State.srcTransition', 'lower', 0);
	metaModelController.set(toolkey + '.stm.State.srcTransition', 'upper', -1);
	
	//stm.Transition.srcの設定
	metaModelController.addAssociation(toolkey + '.stm.Transition', 'src');
	metaModelController.set(toolkey + '.stm.Transition.src', 'etype', toolkey + '.stm.State');
	metaModelController.set(toolkey + '.stm.Transition.src', 'containment', false);
	metaModelController.set(toolkey + '.stm.Transition.src', 'lower', 0);
	metaModelController.set(toolkey + '.stm.Transition.src', 'upper', 1);
	
	//stm.Transition.destの設定
	metaModelController.addAssociation(toolkey + '.stm.Transition', 'dest');
	metaModelController.set(toolkey + '.stm.Transition.dest', 'etype', toolkey + '.stm.State');
	metaModelController.set(toolkey + '.stm.Transition.dest', 'containment', false);
	metaModelController.set(toolkey + '.stm.Transition.dest', 'lower', 0);
	metaModelController.set(toolkey + '.stm.Transition.dest', 'upper', 1);
	
	//stm.State.nameの設定
	metaModelController.addProperty(toolkey + '.stm.State', 'name');
	metaModelController.set(toolkey + '.stm.State.name', 'etype', 'String');
	metaModelController.set(toolkey + '.stm.State.name', 'isID', false);
	metaModelController.set(toolkey + '.stm.State.name', 'lower', 0);
	metaModelController.set(toolkey + '.stm.State.name', 'upper', 1);
	metaModelController.set(toolkey + '.stm.State.name', 'default_value', '');
	
	//notationを設定
	metaModelController.get(toolkey + '.stm.State').notation = toolkey + '.stm.State';
	
	console.log(metaModelController.get(toolkey + '.stm').name);
	console.log(metaModelController.get(toolkey + '.stm.StateDiagram').name);
	console.log(metaModelController.get(toolkey + '.stm.State').name);
	console.log(metaModelController.get(toolkey + '.stm.Transition').name);
	
	var notationController = new NotationController();
	notationController.add(toolkey + '.stm.StateDiagram', new GraphicNotation({gtype:'diagram'}));
	notationController.add(toolkey + '.stm.State', new GraphicNotation({gtype:'node'}));
	notationController.add(toolkey + '.stm.Transition', new GraphicNotation({gtype:'connection', shape:'-'}));
	notationController.add(toolkey + '.stm.State.name', new GraphicNotation({gtype:'label'}));
	notationController.get(toolkey + '.stm.State').containmentFeature = toolkey + '.stm.StateDiagram.states';
	notationController.get(toolkey + '.stm.Transition').containmentFeature = toolkey + '.stm.State.srcTransition';
	notationController.get(toolkey + '.stm.Transition').targetFeature = toolkey + '.stm.Transition.dest';
	
	var toolController = new ToolController();
	toolController.add('State', new Tool('State', toolkey + '.stm.State'));
	toolController.add('Transition', new Tool('Transition', toolkey + '.stm.Transition'));
	return {metaModelController:metaModelController, notationController:notationController, toolController:toolController};
}