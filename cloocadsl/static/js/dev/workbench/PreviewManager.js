function PreviewManager(wb) {
	this.wb = wb;
}


PreviewManager.prototype.init() {
	var deditor = new DiagramEditor('preview','preview', this.wb);
	this.wb.editorTabPanel.add(deditor);
}


PreviewManager.prototype.run() {
	
}
