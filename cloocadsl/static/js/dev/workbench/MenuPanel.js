function MenuPanel(wb) {
	var self = this;
	this.wb = wb;
	var constant_string = new Lang();
	this.panel = {
        tbar: [{
        	id: 'tool-name',
        	html: g_toolinfo.toolkey
        },'-',{
            text: constant_string.file,
            iconCls: 'add16',
            menu: [
                   {
                	   text: constant_string.create,
                	   iconCls: 'add16',
                	   menu: [{
	                	       id: 'create-package',
	                    	   text: constant_string.create_package,
	                    	   iconCls: 'add16',
	                    	   handler : onItemClick
                    	   },{
	                	       id: 'create-template',
                        	   text: constant_string.create_template,
                        	   iconCls: 'add16',
                        	   handler : onItemClick
                    	   }]
                   },{
                	   text: '名前の変更',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   text: '保存',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   text: '全部保存',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'manage-versions',
                	   text: 'バージョン管理',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'vcs-update',
                	   text: '更新',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   }
                   ],
        	handler : onItemClick
        },{
            text: 'ワークベンチ',
            iconCls: 'add16',
            menu: [
                   {
                	   id: 'preview',
                	   text: 'プレビュー',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'check-syntax',
                	   text: 'シンタックス',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   }
                   ]
        },'-',{
            id: 'quick-undo',
            text: '←',
            iconCls: 'add16',
        	handler : onItemClick
        },{
            id: 'quick-redo',
            text: '→',
            iconCls: 'add16',
        	handler : onItemClick
        },{
            id: 'quick-save',
            text: '保存',
            iconCls: 'add16',
        	handler : onItemClick
        },{
            id: 'quick-saveall',
            text: 'すべて保存',
            iconCls: 'add16',
        	handler : onItemClick
        },{
            id: 'quick-commit',
            text: 'コミット',
            iconCls: 'add16',
        	handler : onItemClick
        }]
    };
	function　onItemClick(item) {
		if(item.id == 'create-package') {
			self.wb.metaPackageExplorer.create(g_toolinfo.toolkey);
		}else if(item.id == 'create-template') {
			self.wb.templateExplorer.create();
		}else if(item.id == 'quick-save') {
			self.wb.save();
		}else if(item.id == 'quick-saveall') {
			self.wb.saveAll();
		}else if(item.id == 'quick-commit') {
			 Ext.Msg.prompt('コミットします。','コメントを書いてください。',function(btn,text){
				 if(btn != 'cancel') {
						self.wb.vcs.commit(text);
				 }
			 },null,true,'');
		}else if(item.id == 'vcs-update') {
			self.wb.vcs.update();
		}else if(item.id == 'manage-versions') {
			var win = CloocaWorkbench.ManageVersionsWindow();
			win.show();
		}
	}
	/*
	 * 積極的にレンダリングする
	 */
	Ext.getCmp('menupanel').add(this.panel);
}

MenuPanel.prototype.getPanel = function() {
	return this.panel;
}


MenuPanel.prototype.setAvailabledRedo = function(_is_available) {
	Ext.getCmp('quick-redo').setDisabled(!_is_available);
}

MenuPanel.prototype.setAvailabledSave = function(_is_available) {
	Ext.getCmp('quick-save').setDisabled(!_is_available);
}

function onTempItemClick() {
	
}
