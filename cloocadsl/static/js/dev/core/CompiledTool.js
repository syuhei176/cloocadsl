/**
 * CompiledToolFactory for javascript
 */
function CompiledToolFactory() {}

CompiledToolFactory.createCompiledTool(mmc,nc,tc) {
	var ct = new CompiledTool();
	ct.toolkey = mmc.meta_structure.toolkey;
	mmc.getPackages();
}

function CompiledTool() {
	this.toolkey = '';
	this.pkg = {};
}

function CompiledToolController(ct) {
	this.compiledTool = ct;
}

CompiledToolController.protorype.get() {
	
}

CompiledToolController.protorype.getNotation() {
	
}

CompiledToolController.protorype.getTool() {
	
}
