model_idgen = new IdGenerator();

/**
 * モデルの表現
 * @returns
 */
function Model() {
	this._sys_id = model_idgen.getNewId();
	this._sys_current_version = 1;
}

Model.Package = function(name) {
	this.meta = 'P';
	this.id = model_idgen.getNewId();
	this.name = name;
	this.nestingPackages = {};
	this.classes = {};
	this.editors = {};
}

Model.Class = function(meta_uri) {
	this.meta = 'C';
	this.id = model_idgen.getNewId();
	this.meta_uri = meta_uri;
	//キープロパティ
	this.name = '';
	//純粋なプロパティ
	this.props = {};
	//関連プロパティ
	this.a_props = {};
	//ノーテーション由来のプロパティ
	this.n_props = {};
}

/*
 * templateのことを考える
 * for i in MetaClass.association:
 * for i in MetaClass:
 * Class
 * Class.property
 * 
 * model {
 *   nestingPackages {
 *     aa {
 *     }
 *   }
 *   classes {
 *     abc {
 *       meta_uri
 *       properties
 *       associations
 *       notations
 *     }
 *   }
 *   aaa {
 *   
 *   }
 *   ccc {
 *   
 *   }
 * }
 */
