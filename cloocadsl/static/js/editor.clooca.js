function clooca() {}

clooca.include = function(fn) {
    var script = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.src = "/static/js/"+fn;
    $("#script-div").append( script );
}

clooca.includes = function(fs) {
	for(var i=0;i < fs.length;i++) {
    	var script = document.createElement( 'script' );
    	script.type = 'text/javascript';
    	script.src = "/static/js/"+fs[i];
    	$("#script-div").append( script );
	}
}

function initall() {
	clooca.includes(['dev/core/math2d.js',
	                 'dev/core/controller.js',
	                 'dev/core/arrowhead.js',
	                 'dev/core/DiagramController.js',
	                 'dev/core/DiagramEditor.js',
	                 'dev/core/SequenceEditor.js',
	                 'dev/core/metamodel.js',
	                 'dev/core/model.js',
	                 'dev/core/EditorTabPanel.js',
	                 'dev/editor/controller.js',
	                 'dev/editor/editor.js',
	                 'dev/editor/view.js']);
}
