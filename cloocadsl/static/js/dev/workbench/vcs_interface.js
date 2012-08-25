/**
 * interface of version controll system
 */
function VersionControllSystem(wb) {
	this.wb = wb;
}


VersionControllSystem.prototype.getVersionList = function() {
	
}

VersionControllSystem.prototype.getUnwatchedVersionList = function() {
	
}

VersionControllSystem.prototype.commit = function(comment) {
	$.post('/wb-api/commit', { toolkey : g_toolinfo.toolkey, comment:comment },
			function(data) {
				switch(data) {
				case 0:
					Ext.Msg.alert('権限なし');
					break;
				case 1:
					Ext.Msg.alert('権限なし');
					break;
				case 2:
					Ext.Msg.alert('新たなコミットがあります、まず更新してください。');
					break;
				case 3:
					Ext.Msg.alert('シンタックスエラー');
					break;
				case 4:
					Ext.Msg.alert('変更がありません。');
					break;
				case 5:
					Ext.Msg.alert('コミットに成功しました。');
					break;
				}
			}, "json");	
}

VersionControllSystem.prototype.update = function() {
	var self = this;
//	this.wb.statuspanel.setStatus('更新中');
	$.post('/wb-api/update', { toolkey : g_toolinfo.toolkey },
			function(data) {
				if(data.success) {
					self.wb.metaDatacontroller.reset(data.content.metamodel);
					self.wb.metaPackageExplorer.refresh();
				}
//				self.wb.statuspanel.setStatus('編集中');
			}, "json");	
}