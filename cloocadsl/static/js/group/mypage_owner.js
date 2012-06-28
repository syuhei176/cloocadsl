Ext.require('Ext.tab.*');

Ext.define('User', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'username',  type: 'string'},
        {name: 'role',  type: 'int'},
        {name: 'role_name',  type: 'string'}
    ]
});

function create_group_users_tab() {
	
	var role_state = Ext.create('Ext.data.Store', {
	    fields: ['disp','type'],
	    data : [{'disp':'オーナー','type':0},{'disp':'ワークベンチャー','type':1},{'disp':'メンバー','type':2}]
	});
	
    var ds = Ext.create('Ext.data.Store', {
        model: 'User',
        proxy: {
            type: 'ajax',
            url : '/group/members',
            reader: {
                type: 'json',
            }
        },
        autoLoad: true
    });
    
	var grid = Ext.create('Ext.grid.Panel', {
        columnWidth: 0.60,
        xtype: 'gridpanel',
        store: ds,
        height: 360,
        title:'メンバー',

        columns: [
            {
                text   : '名前',
                flex: 1,
                sortable : true,
                dataIndex: 'username'
            },
            {
                text   : '役割',
                width    : 120,
                sortable : true,
                dataIndex: 'role_name',
            }
        ],
       	tbar:[
              {
                  text:'追加',
                  iconCls:'add',
                  handler:function(btn){
                	  create_adduser_window();
                  }
              },{
                  text:'一括追加',
                  iconCls:'add',
                  handler:function(btn){
                	  create_addusers_window();
                  }
              },{
                  text:'削除',
                  iconCls:'delete',
                  handler:function(btn){
                      var record = grid.getSelectionModel().getSelection()[0];
                      if (record) {
                    	  Ext.Msg.confirm('ユーザの削除','削除しますか？',function(btn){
                    		  if(btn == 'yes') {
                            		$.post('/group/deluser', { pid : record.get('id') },
                            				function(data) {
                            					if(data) {
                                                    ds.remove(record);
                            					}
                            				}, "json");
                    		  }
                    	  });
                      }
                  }
              },{
//                  text:'更新',
                  cls: 'x-btn-icon',
                  icon:'/static/images/editor/update.png',
                  handler:function(btn){
                	  ds.load();
                  }
              }
              ],
        listeners: {
            selectionchange: function(model, records) {
                if (records[0]) {
                    this.up('form').getForm().loadRecord(records[0]);
                }
            }
        }
    });

var gridForm = Ext.create('Ext.form.Panel', {
    id: 'member-tab',
    frame: true,
    title: 'メンバー設定',
    bodyPadding: 5,
    width: 750,
    layout: 'column',

    fieldDefaults: {
        labelAlign: 'left',
        msgTarget: 'side'
    },

    items: [grid, {
        columnWidth: 0.4,
        margin: '0 0 0 10',
        xtype: 'fieldset',
        title:'メンバーの詳細',
        defaults: {
            width: 240,
            labelWidth: 90
        },
        defaultType: 'textfield',
        items: [{
            name: 'id',
            hidden: true
        },{
            fieldLabel: '名前',
            name: 'username'
        },{
	    	name: 'role',
	    	xtype: 'combo',
            fieldLabel: '役割',
	        store: role_state,
	        queryMode: 'local',
	        displayField: 'disp',
	        valueField: 'type',
	        	listeners: {
	        		'change':function(role_combo, newValue, oldValue){
	                    var record = grid.getSelectionModel().getSelection()[0];
	        		}
	        	}
        }, {
        	xtype: 'button',
        	text: '変更',
    	    handler: function() {
                var values = this.up('form').getForm().getValues();
                if(values) {
        			$.ajax({
        				type:"POST",
        				url: '/group/updateuser',
        				data: 'user_id='+values.id+'&new_role='+values.role,
        				dataType: 'json',
        				success: function(data){
        					ds.load();
        				}
        			});
                }
    	    }
        }]
    }],
});
return gridForm;
function create_adduser_window() {
	var tmps = [];
	for(var i=0;i < g_mytools.length;i++) {
		tmps.push({'disp':g_mytools[i].name, 'type':g_mytools[i].id});
	}
	var tools_state = Ext.create('Ext.data.Store', {
	    fields: ['disp','type'],
	    data : tmps
	});

	var win = Ext.create('Ext.window.Window', {
	    title: 'ユーザ追加',
	    height: 240,
	    width: 360,
	    layout: 'vbox',
	    items: [
	            {
	            	xtype: 'form',
	            	url: '/group/adduser',
    	    items: [{
    	    	xtype: 'textfield',
    	    	name: 'username',
    	        fieldLabel: '名前',
    	    	value: '',
    	    },{
    	    	xtype: 'textfield',
    	    	name: 'password',
    	    	value: '',
    	    	inputType: 'password'
    	    }],
    	    buttons: [{
    	    	xtype: 'button',
    	        text: 'OK',
    	        handler: function() {
    	        	alert(this);
    	            var form = this.up('form').getForm();
    	            alert(this.up('form').child('name'));
    	            if (form.isValid()) {
    	                form.submit({
    	                    success: function(form, action) {
    	                    	ds.load();
    	                       Ext.Msg.alert('Success', action.result.msg);
    	                    },
    	                    failure: function(form, action) {
    	                        Ext.Msg.alert('Failed', action.result.msg);
    	                    }
    	                });
    	            }
    	        	win.hide();
    	        }
    	    }]
	    }]
	});
	win.show();
	}
}

function create_space_setting_tab() {
	var way_state = Ext.create('Ext.data.Store', {
	    fields: ['disp','type'],
	    data : [{'disp':'銀行振込３ヶ月','type':0},{'disp':'銀行振込６ヶ月','type':1},{'disp':'銀行振込１２ヶ月','type':2}]
	});
	var contract = {};
	if(g_user.group.state != 2) {
		contract = Ext.create('Ext.form.FieldSet', {
	        columnWidth: 0.4,
	        margin: '0 0 0 10',
	        title:'正式契約する',
	        defaults: {
	            width: 240,
	            labelWidth: 90
	        },
	        defaultType: 'textfield',
	        items: [{
		    	name: 'role',
		    	xtype: 'combo',
	            fieldLabel: '支払い方法',
		        store: way_state,
		        queryMode: 'local',
		        displayField: 'disp',
		        valueField: 'type'
	        }, {
	            fieldLabel: '会社名/個人名',
	            name: 'comp_name'
	        }, {
	            fieldLabel: '会社名/個人名カナ',
	            name: 'comp_name_kana'
	        }, {
	            fieldLabel: '担当者名',
	            name: 'tantousya'
	        }, {
	            fieldLabel: '担当者メールアドレス',
	            name: 'tantousya_email'
	        }, {
	            fieldLabel: '連絡先電話番号',
	            name: 'tel'
	        }, {
	            fieldLabel: '郵便番号',
	            name: 'post_code'
	        }, {
	            fieldLabel: '都道府県',
	            name: 'city'
	        }, {
	            fieldLabel: '住所',
	            name: 'address'
	        }, {
	        	xtype: 'button',
	        	text: '確認画面へ',
	    	    handler: function() {
	                var values = this.up('form').getForm().getValues();
	                if(values) {
	                	/*
	                	 * 確認画面を表示する
	                	 */
	                	//window.open
	                }
	    	    }
	        }]
	    });
	}
	var gridForm = Ext.create('Ext.form.Panel', {
	    id: 'space-tab',
	    frame: true,
	    title: 'グループ設定',
	    bodyPadding: 5,
	    width: 750,
	    layout: 'column',

	    fieldDefaults: {
	        labelAlign: 'left',
	        msgTarget: 'side'
	    },

	    items: [{
	        columnWidth: 0.4,
	        margin: '0 0 0 10',
	        xtype: 'fieldset',
	        title:'グループ設定',
	        defaults: {
	            width: 240,
	            labelWidth: 90
	        },
	        defaultType: 'textfield',
	        items: [{
	            fieldLabel: '名前',
	            name: 'name',
	            value: g_user.group.name
	        },{
	        	html: '登録日：' + g_user.group.registration_date + 'から'
	        },{
	        	html: '契約期間：' + g_user.group.contract_deadline + 'まで利用可能'
	        },{
	        	xtype: 'button',
	        	text: '変更',
	    	    handler: function() {
	                var values = this.up('form').getForm().getValues();
	                if(values) {
	        			$.ajax({
	        				type:"POST",
	        				url: '/update-group',
	        				data: 'name='+values.name,
	        				dataType: 'json',
	        				success: function(data){
	        					
	        				}
	        			});
	                }
	    	    }
	        }]
	        }/*,contract*/],
	});
	return gridForm;
}
