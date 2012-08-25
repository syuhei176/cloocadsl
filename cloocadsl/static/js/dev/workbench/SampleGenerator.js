function SampleGenerator() {}

/*
{
	"FileSystem" : {
		"gtype" : "diagram",
		"associations" : {
					"files" : {
						"type" : "file",
						"containment" : true,
						"upper" : -1,
						"feature" : "contain"
					},
					"folders" : {
						"type" : "folder",
						"containment" : true,
						"upper" : -1,
						"feature" : "contain"
					}
				}
			},
			"Folder" : {
				"id" : "folder",
				"gtype" : "node",
				"associations" : {
					"files" : {
						"type" : "file",
						"containment" : true,
						"upper" : -1,
						"feature" : "child"
					},
					"folders" : {
						"type" : "folder",
						"containment" : true,
						"upper" : -1,
						"feature" : "child"
					}
				},
				"properties" : {
					"name" : {
						"label" : "name",
						"type" : "string"
					}
				}
			},
			"File" : {
				"id" : "file",
				"gtype" : "node",
				"properties" : {
					"name" : {
						"label" : "name",
						"type" : "string"
					}
				}
			}
	}
 */

SampleGenerator.createSampleA = function() {
	var AbstractState = {
		id : 'abstract-state',
		associations : {
			srcTransition : {
				type : 'transition',
				upper : -1,
				feature : 'contain'
			}
		}
	};
	var State = {
		id : 'state',
		gtype : 'node',
		superClass : AbstractState,
		properties : {
			name : {
				label : 'name',
				type : 'string'
			}
		}
	};
	var Transition = {
			id : 'transition',
			gtype : 'connection',
			associations : {
				src : {
					type : 'abstract-state',
					upper : 1,
					feature : 'source'
				},
				dest : {
					type : 'abstract-state',
					upper : 1,
					feature : 'target'
				}
			}
	};
	var StateDiagram = {
		id : 'statediagram',
		gtype : 'diagram',
		associations : {
			states : {
				type : 'abstract-state',
				containment : true,
				upper : -1,
				feature : 'contain'
			},
			transitions : {
				type : 'folder',
				containment : true,
				upper : -1,
				feature : 'child'
			}
		}
	}
	var stm = {
		StateDiagram : StateDiagram,
		AbstractState : AbstractState,
		State : State,
		Transition : Transition
	}
}

SampleGenerator.createSampleB = function() {
	var FileSystem = {
			FileSystem : {
				gtype : 'diagram',
				associations : {
					files : {
						type : 'file',
						containment : true,
						upper : -1,
						feature : 'contain'
					},
					folders : {
						type : 'folder',
						containment : true,
						upper : -1,
						feature : 'contain'
					}
				}
			},
			Folder : {
				id : 'folder',
				gtype : 'node',
				associations : {
					files : {
						type : 'file',
						containment : true,
						upper : -1,
						feature : 'child'
					},
					folders : {
						type : 'folder',
						containment : true,
						upper : -1,
						feature : 'child'
					}
				},
				properties : {
					name : {
						label : 'name',
						type : 'string'
					}
				}
			},
			File : {
				id : 'file',
				gtype : 'node',
				properties : {
					name : {
						label : 'name',
						type : 'string'
					}
				}
			}
	}
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
	//AbstractState
	metaModelController.addClass(toolkey+'.stm', 'AbstractState');
	metaModelController.set(toolkey + '.stm.AbstractState', 'abstract', true);
	
	//State
	metaModelController.addClass(toolkey+'.stm', 'State');
	metaModelController.set(toolkey + '.stm.State', 'generalization', toolkey + '.stm.AbstractState');
	metaModelController.set(toolkey + '.stm.State', 'superClass', toolkey + '.stm.AbstractState');
	//StartState
	metaModelController.addClass(toolkey+'.stm', 'StartState');
	metaModelController.set(toolkey + '.stm.StartState', 'generalization', toolkey + '.stm.AbstractState');
	metaModelController.set(toolkey + '.stm.StartState', 'superClass', toolkey + '.stm.AbstractState');
	//File
	metaModelController.addClass(toolkey+'.stm', 'File');
	
	//Transition
	metaModelController.addClass(toolkey+'.stm', 'Transition');
	
	//stm.StateDiagram.statesの設定
	metaModelController.addAssociation(toolkey + '.stm.StateDiagram', 'states');
	metaModelController.set(toolkey + '.stm.StateDiagram.states', 'etype', toolkey + '.stm.AbstractState');
	metaModelController.set(toolkey + '.stm.StateDiagram.states', 'containment', true);
	metaModelController.set(toolkey + '.stm.StateDiagram.states', 'lower', 0);
	metaModelController.set(toolkey + '.stm.StateDiagram.states', 'upper', -1);
	
	//stm.State.srcTransitionsの設定
	metaModelController.addAssociation(toolkey + '.stm.AbstractState', 'srcTransition');
	metaModelController.set(toolkey + '.stm.AbstractState.srcTransition', 'etype', toolkey + '.stm.Transition');
	metaModelController.set(toolkey + '.stm.AbstractState.srcTransition', 'containment', true);
	metaModelController.set(toolkey + '.stm.AbstractState.srcTransition', 'lower', 0);
	metaModelController.set(toolkey + '.stm.AbstractState.srcTransition', 'upper', -1);
	
	//stm.Transition.srcの設定
	metaModelController.addAssociation(toolkey + '.stm.Transition', 'src');
	metaModelController.set(toolkey + '.stm.Transition.src', 'etype', toolkey + '.stm.AbstractState');
	metaModelController.set(toolkey + '.stm.Transition.src', 'containment', false);
	metaModelController.set(toolkey + '.stm.Transition.src', 'lower', 0);
	metaModelController.set(toolkey + '.stm.Transition.src', 'upper', 1);
	
	//stm.Transition.destの設定
	metaModelController.addAssociation(toolkey + '.stm.Transition', 'dest');
	metaModelController.set(toolkey + '.stm.Transition.dest', 'etype', toolkey + '.stm.AbstractState');
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
	
	//stm.State.filesの設定
	metaModelController.addAssociation(toolkey + '.stm.State', 'files');
	metaModelController.set(toolkey + '.stm.State.files', 'etype', toolkey + '.stm.File');
	metaModelController.set(toolkey + '.stm.State.files', 'containment', true);
	metaModelController.set(toolkey + '.stm.State.files', 'lower', 0);
	metaModelController.set(toolkey + '.stm.State.files', 'upper', -1);

	//notationを設定
	//metaModelController.get(toolkey + '.stm.State').notation = toolkey + '.stm.State';
	
	console.log(metaModelController.get(toolkey + '.stm').name);
	console.log(metaModelController.get(toolkey + '.stm.StateDiagram').name);
	console.log(metaModelController.get(toolkey + '.stm.AbstractState').name);
	console.log(metaModelController.get(toolkey + '.stm.State').name);
	console.log(metaModelController.get(toolkey + '.stm.Transition').name);
	console.log(metaModelController.get(toolkey + '.stm.File').name);
	
	var notationController = new NotationController();
	notationController.addRoot('state-diagram', new DiagramNotation({
		gtype:'diagram',
		target_uri : toolkey + '.stm.StateDiagram'
		}));
	notationController.addChild('state-diagram', 'state', new DiagramNotation({gtype:'node',target_uri:toolkey + '.stm.State'}));
	notationController.addChild('state-diagram', 'start', new DiagramNotation({gtype:'node',target_uri:toolkey + '.stm.StartState'}));
	notationController.addChild('state-diagram', 'transition', new DiagramNotation({gtype:'connection',target_uri:toolkey + '.stm.Transition'}));
	notationController.addChild('state-diagram', 'state-name', new DiagramNotation({gtype:'label',target_uri:toolkey + '.stm.State.name'}));
	notationController.addChild('state-diagram', 'file', new DiagramNotation({gtype:'node',target_uri:toolkey + '.stm.File'}));
	
	notationController.get('state-diagram.state').containmentFeature = toolkey + '.stm.StateDiagram.states';
	notationController.get('state-diagram.state').childrenReference = [toolkey + '.stm.State.files'];
	notationController.get('state-diagram.state').labels = ['name'];
	notationController.get('state-diagram.start').containmentFeature = toolkey + '.stm.StateDiagram.states';
	notationController.get('state-diagram.transition').containmentFeature = toolkey + '.stm.AbstractState.srcTransition';
	notationController.get('state-diagram.transition').sourceFeature = toolkey + '.stm.Transition.src';
	notationController.get('state-diagram.transition').targetFeature = toolkey + '.stm.Transition.dest';
	notationController.get('state-diagram.file').containmentFeature = toolkey + '.stm.StateDiagram.states';
	
	var toolController = new ToolController();
	toolController.add('Start', new Tool('Start', 'state-diagram.start'));
	toolController.add('State', new Tool('State', 'state-diagram.state'));
	toolController.add('Transition', new Tool('Transition', 'state-diagram.transition'));
	toolController.add('File', new Tool('File', 'state-diagram.file'));
	
	//コンパイルが必要では？
	//難読化のため
	//速度効率化のため
	function Compiler(mmc, nc, tc) {
		var ctool = {};	//compiled tool
		nc.getRoot();
		ctool.diagrams = {};
		ctool.packages = {};
		ctool.packages['default'] = {}
		ctool.packages['default']['aaa'] = { type : 'diagram',nodes:{1:{decomposition:'bbb'}} }
		ctool.packages['default']['bbb'] = { type : 'text', text : ''}
		ctool.nodes = {};
		ctool.connections = {};
		return ctool;
	}
	function Combine(rootNotation, mmc) {
		console.log('Start Combine!');
		//var root = mmc.get(rootNotation.target_uri);
		for(var key in rootNotation.children) {
			var child = rootNotation.children[key];
			console.log(child.target_uri);
			mmc.set(child.target_uri, 'notation', child.uri);
		}
		console.log('End Combine!');
	}
	for(var key in notationController.getRoot().children) {
		Combine(notationController.getRoot().children[key], metaModelController);
	}
	console.log(notationController.getRoot());
	return {metaModelController:metaModelController, notationController:notationController, toolController:toolController};
}