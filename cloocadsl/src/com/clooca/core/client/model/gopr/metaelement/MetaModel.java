package com.clooca.core.client.model.gopr.metaelement;

/**
 * 
 * @author Syuhei Hiya
 * Meta Model Class
 *
 */
public class MetaModel {
	public int id;
	public String name;
	public MetaDiagram meta_diagram;
	//Workbenchでのみ使用できる
	public String gen_property;
	
	public MetaModel() {
		meta_diagram = new MetaDiagram();
	}

	public String getGen_property() {
		return gen_property;
	}
	
	
}
