function ToolCompiler(metamodel) {
	this.src = metamodel;
	this.ctool = new CompiledTool();
}

ToolCompiler.prototype.Compile = function() {
	var self = this;
	parsePackage(this.src);
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
	function parsePackage(p) {
		if(p.content) {
			if(p.content.text) {
				var classes = JSON.parse(p.content.text);
				for(var key in classes) {
					console.log(key);
					if(self.ctool.classes.hasOwnProperty(key)) {
						self.ctool.classes[key].combine(classes[key]);
					}else{
						self.ctool.classes[key] = new CompiledTool.Class(classes[key]);
					}
				}
			}
		}
		for(var key in p.nestingPackages) {
			parsePackage(p.nestingPackages[key]);
		}
	}
}

ToolCompiler.prototype.getCompiledTool = function() {
	return this.ctool;
}

function CompiledTool() {
	this.classes = {};
	this.root = null;
}

CompiledTool.prototype.getRootClass = function() {
	return this.root;
}

CompiledTool.prototype.getClass = function(id) {
	return this.classes[id];
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

CompiledTool.Class = function(option) {
	this.id = null;
	this.name = null;
	this.root = false;
	this.abstract = false;
	this.superClass = null;
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
    this.gtype = option.gtype;
    this.associations = option.associations;
    this.properties = option.properties;
    this.shape = null;
	if(option.shape) {
	    this.shape = option.shape;
	}
	this.idprop = null;
}

CompiledTool.Class.prototype.combine = function(option) {
	for(var key in option) {
		this[key] = option[key];
	}
}

CompiledTool.Class.prototype.compile = function(option) {
	for(var key in this.associations) {
		this.associations[key].name = key;
	}
	for(var key in this.properties) {
		if(this.properties[key].isId) {
			this.idprop = this.properties[key];
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
		instance[key] = {
				_sys_exist:true
		};
	}
	return instance;
}

/**
 * checkContain
 */
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

/**
 * getContains
 */
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

CompiledTool.Class.prototype.getName = function() {
	return this.name;
}