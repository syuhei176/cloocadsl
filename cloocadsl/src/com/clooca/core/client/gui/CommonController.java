package com.clooca.core.client.gui;

public class CommonController {
	
	public static IModelExplorer mIModelExplorer;
	
	
	public static void SetModelExplorer(IModelExplorer me) {
		mIModelExplorer = me;
	}
	
	static public IModelExplorer GetModelExplorer() {
		return mIModelExplorer;
	}
	
}
