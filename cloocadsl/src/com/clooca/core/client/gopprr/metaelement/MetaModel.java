package com.clooca.core.client.gopprr.metaelement;

import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.clooca.webutil.client.RequestGenerator;

/**
 * 
 * @author Syuhei Hiya
 * Meta Model Class
 *
 */
public class MetaModel {
	String name;
	MetaDiagram meta_diagram;
	
	public MetaModel() {
		meta_diagram = new MetaDiagram(0);
	}
	
	public void createSample() {
//		meta_diagram.createSample();
//		meta_diagram.load(0);
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public MetaDiagram getMetaDiagram() {
		return meta_diagram;
	}
	
	public void load(int id) {
      	RequestGenerator.send("./cgi/core/metamodel.cgi", "metamodel_id="+id, new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
//    			JSONObject obj = JSONParser.parseLenient(response.getText()).isObject();
    		}});

	}
	
}
