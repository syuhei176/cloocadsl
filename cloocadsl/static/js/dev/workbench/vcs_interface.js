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

VersionControllSystem.prototype.commit = function() {
	$.post('/wb-api/commit', { toolkey : g_toolinfo.toolkey, comment:'' },
			function(data) {
				if(data) {
				}
			}, "json");	
}

VersionControllSystem.prototype.update = function() {
	var self = this;
	this.wb.statuspanel.setStatus('更新中');
	$.post('/wb-api/update', { toolkey : g_toolinfo.toolkey },
			function(data) {
				if(data.success) {
					self.wb.metaDatacontroller.reset(data.content.metamodel);
					self.wb.metaPackageExplorer.refresh();
				}
				self.wb.statuspanel.setStatus('編集中');
			}, "json");	
}