function checkoutview() {
	$.post('/mvcs/group_rep_list', {},
			function(data) {
				if(data) {
					console.log('id\tname\thead_version');
					for(var i=0;i < data.length;i++) {
						console.log(data[i].id + '\t' + data[i].name + '\t' + data[i].head_version);
					}
					 var selModel = Ext.create('Ext.selection.RowModel', {
						 mode: 'SINGLE',
					        listeners: {
					            selectionchange: function(sm, selections) {
					                for(var i=0;i < selections.length;i++) {
					                	console.log(i + '=' + selections[i].get('id'));
					                }
					            }
					        }
					    });
					var win = Ext.create('Ext.window.Window', {
					    title: 'Checkout',
					    height: 200,
					    width: 400,
					    layout: 'fit',
					    items: {
					        xtype: 'grid',
					        border: false,
					        columns: [{text: "name", dataIndex: 'name'},{text: "head version", dataIndex: 'head_version'}],
					        store: Ext.create('Ext.data.Store', {data:data,fields:['id','name','head_version']}),
						    selModel: selModel,
						    dockedItems: [{
					            xtype: 'toolbar',
					            dock: 'bottom',
					            ui: 'footer',
					            layout: {
					                pack: 'center'
					            },
					            items: []
					        }, {
					            xtype: 'toolbar',
					            items: [{
					                text:'Checkout',
					                tooltip:'checkout',
					                iconCls:'add',
					                handler : function() {
					                	console.log(''+selModel.getSelection()[0].get('id'));
					                	if(window.confirm('チェックアウトします。よろしいですか？')) {
						                	checkout(selModel.getSelection()[0].get('id'), function(){win.hide();});
					                	}
					                }
					            }]
					        }]
					     }
					}).show();
				}
			}, "json");
}

function import_to_rep_view() {
	$.post('/mvcs/group_rep_list', {},
			function(data) {
				if(data) {
					console.log('id\tname\thead_version');
					for(var i=0;i < data.length;i++) {
						console.log(data[i].id + '\t' + data[i].name + '\t' + data[i].head_version);
					}
					 var selModel = Ext.create('Ext.selection.RowModel', {
						 mode: 'SINGLE',
					        listeners: {
					            selectionchange: function(sm, selections) {
					                for(var i=0;i < selections.length;i++) {
					                	console.log(i + '=' + selections[i].get('id'));
					                }
					            }
					        }
					    });
					var win = Ext.create('Ext.window.Window', {
					    title: 'Import',
					    height: 200,
					    width: 400,
					    layout: 'fit',
					    items: {
					        xtype: 'grid',
					        border: false,
					        columns: [{text: "name", dataIndex: 'name'},{text: "head version", dataIndex: 'head_version'}],
					        store: Ext.create('Ext.data.Store', {data:data,fields:['id','name','head_version']}),
						    selModel: selModel,
						    dockedItems: [{
					            xtype: 'toolbar',
					            dock: 'bottom',
					            ui: 'footer',
					            layout: {
					                pack: 'center'
					            },
					            items: []
					        }, {
					            xtype: 'toolbar',
					            items: [{
					                text:'Import',
					                tooltip:'import',
					                iconCls:'add',
					                handler : function() {
					                	console.log(''+selModel.getSelection()[0].get('id'));
					                	if(window.confirm('リポジトリにインポートします。よろしいですか？')) {
						                	import_to_rep(selModel.getSelection()[0].get('id'), function() {
						                		win.hide();
						                	});
					                	}
					                }
					            }]
					        }]
					     }
					}).show();
				}
			}, "json");
}

function delete_rep_view() {
	$.post('/mvcs/group_rep_list', {group_id : g_projectinfo.group.id},
			function(data) {
				if(data) {
					console.log('id\tname\thead_version');
					for(var i=0;i < data.length;i++) {
						console.log(data[i].id + '\t' + data[i].name + '\t' + data[i].head_version);
					}
					 var selModel = Ext.create('Ext.selection.RowModel', {
						 mode: 'SINGLE',
					        listeners: {
					            selectionchange: function(sm, selections) {
					                for(var i=0;i < selections.length;i++) {
					                	console.log(i + '=' + selections[i].get('id'));
					                }
					            }
					        }
					    });
					var win = Ext.create('Ext.window.Window', {
					    title: 'Delete',
					    height: 200,
					    width: 400,
					    layout: 'fit',
					    items: {
					        xtype: 'grid',
					        border: false,
					        columns: [{text: "name", dataIndex: 'name'},{text: "head version", dataIndex: 'head_version'}],
					        store: Ext.create('Ext.data.Store', {data:data,fields:['id','name','head_version']}),
						    selModel: selModel,
						    dockedItems: [{
					            xtype: 'toolbar',
					            dock: 'bottom',
					            ui: 'footer',
					            layout: {
					                pack: 'center'
					            },
					            items: []
					        }, {
					            xtype: 'toolbar',
					            items: [{
					                text:'Delete',
					                tooltip:'delete',
					                iconCls:'add',
					                handler : function() {
					                	console.log(''+selModel.getSelection()[0].get('id'));
					                	if(window.confirm('リポジトリ「'+selModel.getSelection()[0].get('name')+'」を削除します。')) {
						                	delete_rep(selModel.getSelection()[0].get('id'), function() {
						                		win.hide();
						                	});
					                	}
					                }
					            }]
					        }]
					     }
					}).show();
				}
			}, "json");
}

function update_to_ver_view() {
	$.post('/mvcs/ver_list', {pid : g_projectinfo.id},
			function(data) {
				if(data) {
					console.log('id\tversion\tcomment');
					for(var i=0;i < data.length;i++) {
						console.log(data[i].id + '\t' + data[i].version + '\t' + data[i].content);
					}
					 var selModel = Ext.create('Ext.selection.RowModel', {
						 mode: 'SINGLE',
					        listeners: {
					            selectionchange: function(sm, selections) {
					                for(var i=0;i < selections.length;i++) {
					                	console.log(i + '=' + selections[i].get('version'));
					                }
					            }
					        }
					    });
					var win = Ext.create('Ext.window.Window', {
					    title: 'update to previous version',
					    height: 200,
					    width: 400,
					    layout: 'fit',
					    items: {
					        xtype: 'grid',
					        border: false,
					        columns: [{text: "version", dataIndex: 'version'},{text: "comment", dataIndex: 'content', width: 160}],
					        store: Ext.create('Ext.data.Store', {data:data,fields:['version','content']}),
						    selModel: selModel,
						    dockedItems: [{
					            xtype: 'toolbar',
					            dock: 'bottom',
					            ui: 'footer',
					            layout: {
					                pack: 'center'
					            },
					            items: []
					        }, {
					            xtype: 'toolbar',
					            items: [{
					                text:'update',
					                tooltip:'update',
					                iconCls:'add',
					                handler : function() {
					                	console.log(''+selModel.getSelection()[0].get('version'));
					                	update_to_ver(selModel.getSelection()[0].get('version'), function() {
					                		win.hide();
					                	});
					                }
					            }]
					        }]
					     }
					}).show();
				}
			}, "json");
}

/**
 * commit
 * @param pid
 */
function commit() {
	g_model.id = g_projectinfo.id;
	var xml = JSON.stringify(g_model);
	 Ext.Msg.prompt('コミットします。','コメントを書いてください。',function(btn,text){
		 if(btn != 'cancel') {
				Ext.MessageBox.show({title: 'Please wait',msg: 'Commit',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
				$.post('/mvcs/commit', { pid : g_projectinfo.id, comment : text, xml : xml },
						function(data) {
							if(data) {
								console.log('commit state = '+data);
								Ext.MessageBox.hide();
								if(data == 1) {
									Ext.MessageBox.alert("コミットステート","成功");
									update();
								}else if(data == 2) {
									Ext.MessageBox.alert("コミットステート","最新バージョンに更新してください。");
								}else if(data == 3) {
									Ext.MessageBox.alert("コミットステート","変更がありません。");
								}
							}else{
								Ext.MessageBox.hide();
								Ext.MessageBox.alert("コミットステート","失敗：リポジトリが存在しないか、チェックアウトしていません。");
							}
						}, "json");
		 }
	 },null,true,'');
}

/**
 * update
 * @param pid
 */
function update() {
	Ext.MessageBox.show({title: 'Please wait',msg: 'Update',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
	$.post('/mvcs/update', { pid : g_projectinfo.id },
			function(data) {
				if(data.ret_state == 0){
					console.log('loaded json string = '+data.xml);
					g_projectinfo.xml = data.xml;
					readModel(data.xml);
		        	g_modelExplorer = new ModelExplorer();
					Ext.MessageBox.hide();
					editortabpanel.close();
				}else{
					alert('update error');
					Ext.MessageBox.hide();
				}
			}, "json");
}

/**
 * update_to_ver
 * @param ver
 */
function update_to_ver(ver, cb) {
	$.post('/mvcs/update_to_version', { pid : g_projectinfo.id , version : ver},
			function(data) {
		if(data.ret_state == 0){
			console.log('loaded json string = '+data.xml);
			g_projectinfo.xml = data.xml;
			readModel(data.xml);
        	g_modelExplorer = new ModelExplorer();
			Ext.MessageBox.hide();
			editortabpanel.close();
			cb();
		}else{
			alert('update error');
			Ext.MessageBox.hide();
		}
			}, "json");
}

/**
 * create_rep
 */
function create_rep() {
	 Ext.Msg.prompt('確認','リポジトリを作成しますか？',function(btn, text){
		 if(btn != 'no' && text.length != 0) {
				$.post('/mvcs/create_rep', { pid : g_projectinfo.id, name : text, space_key : g_userinfo.space_key },
						function(data) {
							if(data) {
								
							}else{
								Ext.Msg.alert('リポジトリの名前が長過ぎます。');
							}
						}, "json");
		 }
	 },null,false);
}

/**
 * clear_rep
 */
function clear_rep(rep_id) {
	$.post('/mvcs/clear_rep', { rep_id : rep_id },
			function(data) {
				if(data) {
					console.log('loaded json string = '+data.xml);
				}
			}, "json");
}

/**
 * delete_rep
 */
function delete_rep(rep_id, cb) {
	$.post('/mvcs/delete_rep', { rep_id : rep_id, group_id : g_projectinfo.group.id},
			function(data) {
				if(data) {
					console.log('Success');
					cb();
				}else{
					console.log('Failure');
				}
			}, "json");
}

/**
 * history view
 */
function history_view() {
	$.post('/mvcs/gethistory', {pid : g_projectinfo.id},
			function(data) {
				if(data) {
					console.log('version\tcomment');
					for(var i=0;i < data.length;i++) {
						console.log(data[i].version + '\t' + data[i].content);
					}
				}
			}, "json");
}


/**
 * ver_list
 */
function ver_list() {
	$.post('/mvcs/ver_list', {pid : g_projectinfo.id},
			function(data) {
				if(data) {
					console.log('version\tcomment');
					for(var i=0;i < data.length;i++) {
						console.log(data[i].version + '\t' + data[i].content);
					}
				}
			}, "json");
}



/**
 * rep_list
 */
function rep_list() {
	$.post('/mvcs/group_rep_list', {group_id : g_projectinfo.group.id},
			function(data) {
				if(data) {
					console.log('id\tname\thead_version');
					for(var i=0;i < data.length;i++) {
						console.log(data[i].id + '\t' + data[i].name + '\t' + data[i].head_version);
					}
				}
			}, "json");
}

/**
 * checkout
 */
function checkout(rep_id, cb) {
	$.post('/mvcs/checkout', {pid:g_projectinfo.id, rep_id:rep_id},
			function(data) {
				if(data.ret_state == 0){
					readModel(data.xml);
					cb();
				}else{
					alert('checkout error');
				}
			}, "json");
}

/**
 * import_to_rep
 */
function import_to_rep(rep_id, cb) {
	g_model.id = g_projectinfo.id;
	var xml = JSON.stringify(g_model);
	$.post('/mvcs/import', {xml:xml, rep_id:rep_id},
			function(data) {
				if(data == 1){
					cb();
				}else{
					alert('checkout error');
				}
			}, "json");
}
