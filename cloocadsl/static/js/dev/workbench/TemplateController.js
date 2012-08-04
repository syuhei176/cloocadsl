/**
 * 
 * @returns
 */
function TemplateController() {
	this.templates = [];
	this.listeners = [];
}

/**
 * 
 */
TemplateController.prototype.load = function() {
	$.get('/wb-api/templates/'+g_toolinfo.toolkey,{},
			function(data) {
				if(data) {
				}
			}, "json");
}

/**
 * 
 */
TemplateController.prototype.save = function(name, package_uri, content) {
	$.post('/wb-api/save-template', { toolkey : g_toolinfo.toolkey, name : name, package_uri : package_uri, content : content },
			function(data) {
				if(data) {
				}
			}, "json");	
}

/**
 * 
 */
TemplateController.prototype.create = function(key, package_uri, cb) {
	$.post('/wb-api/create-template', { toolkey : g_toolinfo.toolkey, name : key, package_uri : package_uri },
			function(data) {
				if(data) {
					cb();
				}
			}, "json");
}

/**
 * 
 */
TemplateController.prototype.del = function(key, cb) {
	$.post('/wb-api/del-template', { toolkey : g_toolinfo.toolkey, name : key},
			function(data) {
				if(data) {
					cb();
				}
			}, "json");	
}

/**
 * 
 */
TemplateController.prototype.update = function(key) {
	
}

/**
 * 
 */
TemplateController.prototype.getTemplates = function() {
}

/**
 * 
 */
TemplateController.prototype.setChangeNotification = function(key, cb) {
	this.listeners.push({name:key,cb:cb});
}

/**
 * 
 */
TemplateController.prototype.fireEventchange = function(key, newValue) {
	for(var i=0;i < this.listeners.length;i++) {
		if(this.listeners[i].name == key) {
			this.listeners[i].cb(newValue);
		}
	}
}