function MenuPanel(wb) {
	var self = this;
	this.wb = wb;
	this.panel = {
        tbar: [{
        	id: 'tool-name',
        	html: 'サンプルツール'
        },'-',{
            text: 'プロジェクト',
            iconCls: 'add16',
            menu: [
                   {
                	   text: 'ソースコード生成',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   text: '設定',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   }
                   ],
        	handler : onItemClick
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
            id: 'quick-commit',
            text: 'コミット',
            iconCls: 'add16',
        	handler : onItemClick
        },{
            id: 'quick-run',
            text: '実行',
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
			var model_json = JSON.stringify(self.wb.modelController.getModel());
			$.post('/ed-api/save', { project_id : g_project.id, model : model_json },
					function(data) {
						if(data) {
						}
					}, "json");
		}
	}
	/*
	 * 積極的にレンダリングする
	 */
	Ext.getCmp('ed-menupanel').add(this.panel);
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
