/**
 * Save MetaModel
 * グローバル変数g_metamodelの内容をサーバに保存する。
 */
function saveMetaModel(id, fn) {
	var xml = JSON.stringify(g_metamodel);
	$.post('/wb/save', { id : id, xml : xml }, fn, "json");
}



/**
 * Save MetaModel
 * グローバル変数g_metamodelの内容をサーバに保存する。
 */
function saveAll(fn) {
	var xml = JSON.stringify(g_metamodel);
//	var targets = JSON.stringify(g_metaproject.targets);
	$.post('/metamodel-save', { id : g_metaproject.id, name: g_metaproject.name, visibillity: g_metaproject.visibillity, xml : xml, welcome_message:g_metaproject.welcome_message}, fn, "json");
//	$.post('/metamodel-save', { id : g_metaproject.id, name: g_metaproject.name, visibillity: g_metaproject.visibillity, xml : xml, welcome_message:g_metaproject.welcome_message, targets:targets}, fn, "json");
}

/**
 * Load MetaModel
 * グローバル変数g_modelにサーバからロードしたモデルをセットする。
 * @param pid
 */
function wb_loadMetaModel(id) {
	Ext.MessageBox.show({title: 'Please wait',msg: 'Loading...',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
					g_metaproject = g_toolinfo;
					Ext.getCmp('tool-name').setText('プロジェクト名：'+g_metaproject.name);
					console.log('loaded json string = '+g_metaproject.xml);
					if(g_metaproject.xml == ' ' || g_metaproject.xml == null || g_metaproject.xml.length == 0) {
						g_metamodel = new MetaModel(g_metaproject.id, g_metaproject.name);
					}else{
						g_metamodel = JSON.parse(g_metaproject.xml);
					}
					if(g_metaproject.config == ' ' || g_metaproject.config == null || g_metaproject.config == 0) {
						g_wbconfig = {targets:[]};
					}else{
						g_wbconfig = JSON.parse(g_metaproject.config);
					}
					metadiagram_IdGenerator = new IdGenerator();
					metaobject_IdGenerator = new IdGenerator();
					metarelation_IdGenerator = new IdGenerator();
					metaproperty_IdGenerator = new IdGenerator();

					for(var key in g_metamodel.metadiagrams) {
						if(g_metamodel.metadiagrams[key] != null) {
							metadiagram_IdGenerator.setOffset(g_metamodel.metadiagrams[key].id);
						}
					}
					for(var key in g_metamodel.metaobjects) {
						if(g_metamodel.metaobjects[key] != null) {
							metaobject_IdGenerator.setOffset(g_metamodel.metaobjects[key].id);
						}
					}
					for(var key in g_metamodel.metarelations) {
						if(g_metamodel.metarelations[key] != null) {
							metarelation_IdGenerator.setOffset(g_metamodel.metarelations[key].id);
						}
					}
					for(var key in g_metamodel.metaproperties) {
						if(g_metamodel.metaproperties[key] != null) {
							metaproperty_IdGenerator.setOffset(g_metamodel.metaproperties[key].id);
						}
					}
					load_templates();
					Ext.MessageBox.hide();
}

function check_metamodel() {
	var flg = true;
//ルートダイアグラムは存在するか
	flg = false;
	for(a in g_metamodel.metadiagrams) {
		if(g_metamodel.metadiagram == g_metamodel.metadiagrams[a].id) {
			flg = true;
		}
	}
	if(flg) {
		//OK
	}else{
		return false;
	}
	//関係の存在
	return true;
}
