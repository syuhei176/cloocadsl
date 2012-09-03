function ToolCompiler(metamodel) {
	this.src = metamodel;
	this.ctool = new CompiledTool();
}

ToolCompiler.prototype.Compile = function() {
	var self = this;
	if(!parsePackage(this.src)) return false;
	for(var key in this.ctool.classes) {
		this.ctool.classes[key].compile();
		if(this.ctool.classes[key].root) {
			this.ctool.root = this.ctool.classes[key];
		}
		if(!this.ctool.classes[key].id) {
			this.ctool.classes[key].id = key;
		}
		if(!this.ctool.classes[key].name) {
			this.ctool.classes[key].name = key;
		}
		if(this.ctool.classes[key].superClass) {
			this.ctool.classes[key].superClass = this.ctool.classes[this.ctool.classes[key].superClass];
		}
	}
	return true;
	function parsePackage(p) {
		if(p.content) {
			if(p.lang_type == 'dsml' && p.content.text) {
				var classes = null;
				try {
					classes = JSON.parse(p.content.text);
				} catch(e) {
					return false;
				}
				for(var key in classes) {
					console.log(key);
					if(self.ctool.classes.hasOwnProperty(key)) {
						self.ctool.classes[key].combine(classes[key]);
					}else{
						self.ctool.classes[key] = new CompiledTool.Class(classes[key]);
					}
				}
			}else if(p.lang_type == 'dsl'){
				if(self.ctool.classes.hasOwnProperty('text')) {
					var parser = PEG.buildParser(p.content, {cache:false, trackLineAndColumn:true});
					self.ctool.classes['text'].parser = parser;
				}else{
					var parser = PEG.buildParser(p.content);
					self.ctool.classes['text'] = new CompiledTool.DSLClass('text', parser);
				}
			}
		}
		for(var key in p.nestingPackages) {
			if(!parsePackage(p.nestingPackages[key])) {
				return false;
			}
		}
		return true;
	}
}

ToolCompiler.prototype.getCompiledTool = function() {
	return this.ctool;
}

function CompiledTool() {
	this.classes = {};
	this.root = null;
	this.parser = null;
}

CompiledTool.prototype.getRootClass = function() {
	return this.root;
}

CompiledTool.prototype.getClass = function(id) {
	if(this.classes.hasOwnProperty(id))
		return this.classes[id];
	else
		return null;
}

/**
 * 抽象クラスは渡さない
 */
CompiledTool.prototype.getContainableClasses = function(klass) {
	var klasses = [];
	for(var key in klass.associations) {
		if(klass.associations[key].containment) {
			var k = this.classes[klass.associations[key].type];
			if(k.abstract) {
				klasses = klasses.concat(this.getSubClasses(k));
			}else{
				klasses.push(this.classes[klass.associations[key].type]);
			}
		}
	}
	return klasses;
}

CompiledTool.prototype.getSubClasses = function(klass) {
	var klasses = [];
	for(var key in this.classes) {
		if(klass.id == this.classes[key].superClass.id) {
			klasses.push(this.classes[key]);
		}
	}
	return klasses;
}

CompiledTool.DSLClass = function(key, parser) {
	this.id = key;
	this.name = key;
	this.gtype = 'text';
	this.root = false;
	this.parser = parser;
}

CompiledTool.DSLClass.prototype.getParser = function() {
	return this.parser;
}

CompiledTool.DSLClass.prototype.compile = function() {
	
}
CompiledTool.DSLClass.prototype.combine = function(option) {
	for(var key in option) {
		this[key] = option[key];
	}
}
CompiledTool.DSLClass.prototype.getInstance = function() {
	//名前がある場合と、自動idの場合があるはず
	var id;
	if(this.idprop) {
		id = 'unNamed' + this.id + model_idgen.getNewId();
	}else{
		id = model_idgen.getNewId();
	}
	var instance = {
			_sys_name:id,
			_sys_meta:this.id,
			_sys_exist:true,
			_sys_lang: 'text'
//			_sys_uri:uri+'.'+'a'
			};
	return instance;
}

CompiledTool.DSLClass.prototype.getName = function() {
	return this.name;
}

/**
 * Class
 */
CompiledTool.Class = function(option) {
	/*
	 * 初期化
	 */
	this.id = null;
	this.name = null;
	this.root = false;
	this.abstract = false;
	this.superClass = null;
    this.shape = null;
	this.idprop = null;
    this.associations = {};
    this.properties = {};
    this.toolpalet = [];
    this.init(option);
}

/**
 * 
 */
CompiledTool.Class.prototype.init = function(option) {
	if(option.id) {
	    this.id = option.id;
	}
	if(option.name) {
	    this.name = option.name;
	}
	if(option.root) {
	    this.root = true;
	}
	if(option.abstract) {
	    this.abstract = true;
	}
	if(option.superClass) {
	    this.superClass = option.superClass;
	}
	if(option.gtype) {
	    this.gtype = option.gtype;
	}
	if(option.shape) {
	    this.shape = option.shape;
	}
	for(var key in option.associations) {
		this.associations[key] = option.associations[key];
	}
	for(var key in option.properties) {
		this.properties[key] = option.properties[key];
	}
	if(option.toolpalet) {
		for(var i=0;i < option.toolpalet.length;i++) {
			this.toolpalet.push(option.toolpalet[i]);
		}
	}
	this.idprop = null;
}

CompiledTool.Class.prototype.combine = function(option) {
	this.init(option);
	/*
	for(var key in option) {
		this[key] = option[key];
	}
	*/
}

CompiledTool.Class.prototype.compile = function(option) {
	for(var key in this.associations) {
		this.associations[key].name = key;
	}
	for(var key in this.properties) {
		if(this.properties[key].isId) {
			this.idprop = this.properties[key];
		}
		this.properties[key].type = this.properties[key].type.toLowerCase();
		if(this.properties[key].upper == undefined) {
			this.properties[key].upper = 1;
		}
	}
}

CompiledTool.Class.prototype.getInstance = function() {
	//名前がある場合と、自動idの場合があるはず
	var id;
	if(this.idprop) {
		id = 'unNamed' + this.id + model_idgen.getNewId();
	}else{
		id = model_idgen.getNewId();
	}
	var instance = {
			_sys_name:id,
			_sys_meta:this.id,
			_sys_exist:true
//			_sys_uri:uri+'.'+'a'
			};
	for(var key in this.associations) {
		instance[key] = {};
	}
	for(var key in this.properties) {
		/*
		instance[key] = {
				_sys_exist:true
		};
		*/
		instance[key] = "";
	}
	return instance;
}

/**
 * checkContain
 */
/*
CompiledTool.Class.prototype.checkContain = function(klass) {
	for(var key in this.associations) {
		if(this.associations[key].containment) {
			if(this.associations[key].type == klass.id) {
				return true;
			}
			if(klass.superClass) {
				if(this.associations[key].type == klass.superClass.id) {
					return true;
				}
			}
		}
	}
	return false;
}
*/

/**
 * getContains
 */
/*
CompiledTool.Class.prototype.getAssociation = function(klass) {
	for(var key in this.associations) {
		if(this.associations[key].containment) {
			if(this.associations[key].type == klass.id || 
					this.associations[key].type == klass.superClass.id) {
				return this.associations[key];
			}
		}
	}
	return null;
}
*/

CompiledTool.Class.prototype.getContainAssociation = function(klass) {
	var assos = [];
	for(var key in this.associations) {
		for(var k = klass;k != null;k = k.superClass) {
			if(this.associations[key].type == k.id) {
				if(this.associations[key].containment) {
					return this.associations[key];
				}
			}
		}
	}
	if(this.superClass) {
		return this.superClass.getAssociations(klass);
	}
	return null;
}

/**
 * @param klass
 * @param option
 */
CompiledTool.Class.prototype.getAssociations = function(klass, option) {
	var assos = [];
	for(var key in this.associations) {
		for(var k = klass;k != null;k = k.superClass) {
			if(this.associations[key].type == k.id) {
				assos.push(this.associations[key]);
			}
		}
	}
	if(this.superClass) {
		assos = assos.concat(this.superClass.getAssociations(klass));
	}
	return assos;
}

CompiledTool.Class.prototype.getName = function() {
	return this.name;
}
