/**
 * Save MetaModel
 * グローバル変数g_metamodelの内容をサーバに保存する。
 */
function saveMetaModel(id, fn) {
	var xml = JSON.stringify(g_metamodel);
	$.post('/msave', { id : id, xml : xml }, fn, "json");
}

/**
 * Save MetaModel
 * グローバル変数g_metamodelの内容をサーバに保存する。
 */
function saveAll(fn) {
	var xml = JSON.stringify(g_metamodel);
	$.post('/metamodel-save', { id : g_metaproject.id, name: g_metaproject.name, visibillity: g_metaproject.visibillity, xml : xml, welcome_message:g_metaproject.welcome_message}, fn, "json");
}

/**
 * Load MetaModel
 * グローバル変数g_modelにサーバからロードしたモデルをセットする。
 * @param pid
 */
function wb_loadMetaModel(id) {
	Ext.MessageBox.show({title: 'Please wait',msg: 'Loading...',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
	$.post('/mload', { id : id },
			function(data) {
				if(data) {
					g_metaproject = data;
					Ext.getCmp('vsibillity_setting').setValue(g_metaproject.visibillity);
					Ext.getCmp('name_setting').setValue(g_metaproject.name);
					console.log('loaded json string = '+data.xml);
					if(data.xml == ' ' || data.xml == null || data.xml.length == 0) {
						g_metamodel = new MetaModel();
					}else{
						g_metamodel = JSON.parse(data.xml);
					}
					g_config_of_template = data.template;
					for(var i=0;i < g_metamodel.metaobjects.length;i++) {
						if(g_metamodel.metaobjects[i] != null) {
							metaobject_IdGenerator.setOffset(g_metamodel.metaobjects[i].id);
						}
					}
					Ext.MessageBox.hide();
				}
			}, "json");
}