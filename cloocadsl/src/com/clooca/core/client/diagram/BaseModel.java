package com.clooca.core.client.diagram;

import java.util.ArrayList;

import com.clooca.core.client.mdd.ExternalEvents;
import com.google.gwt.core.client.JavaScriptObject;

/**
 * 
 * @author Syuhei Hiya
 *
 */
public interface BaseModel {
	
	/**
	 * get model name
	 * @return
	 */
	public String getName();	
	
	/**
	 * set model name
	 * @param name
	 */
	public void setName(String name);	
		
	/**
	 * xml to model
	 * @param node
	 * @param list
	 */
	public void fromXML(com.google.gwt.xml.client.Node node, ArrayList<Graph> list);
	
	/**
	 * model to xml
	 * @return
	 */
	public String toXML();
	
	/**
	 * model to executable xml
	 * @return
	 */
	public String toExeXML();
	
	/**
	 * model to Javscript Object
	 * @return
	 */
	public JavaScriptObject toJavaScriptObject();
	
	/**
	 * set target language
	 * @param target
	 */
	public void setTarget(String target);
	
	/**
	 * get target language
	 * @return
	 */
	public String getTarget();
	
	/**
	 * get model's root diagram
	 * @return
	 */
	public Graph getRootDiagram();
	
	/**
	 * get model compiler server URL
	 * @return
	 */
	public String getServerURL();
	
	/**
	 * get target language list
	 * @return
	 */
	public ArrayList<String> getTargetList();
	
	/**
	 * get external API
	 * @return
	 */
	public String getExternalAPI();
	
	/**
	 * get external events
	 * @return
	 */
	public ExternalEvents getExternalEvents();	
	
	/**
	 * get metamodel name
	 * @return
	 */
	public String getMetaModelName();
}
