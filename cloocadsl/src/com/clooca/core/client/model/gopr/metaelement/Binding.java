package com.clooca.core.client.model.gopr.metaelement;

import com.clooca.core.client.model.gopr.element.ModelElement;
import com.clooca.webutil.client.RequestGenerator;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;

public class Binding {
	public MetaDiagram parent;
	public MetaObject src;
	public MetaObject dest;
	
	public Binding(MetaObject src, MetaObject dest) {
		this.src = src;
		this.dest = dest;
	}
	
	
	public MetaObject getSrc() {
		return src;
	}

	public MetaObject getDest() {
		return dest;
	}

	
	public void load(int id) {
      	RequestGenerator.send("/cgi-bin/core/binding.cgi", "id="+id, new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			JSONObject jsonObject = JSONParser.parse(response.getText()).isObject();
    	        JSONNumber jsonNumber;
    	        
    			if((jsonObject = jsonObject.isObject()) != null) {
    				
    				if((jsonNumber = jsonObject.get("src").isNumber()) != null) {
    					int src_id = (int) (jsonNumber.doubleValue());
    					src = parent.getMetaObject(src_id);
    					
    				}
    				if((jsonNumber = jsonObject.get("dest").isNumber()) != null) {
    					int dest_id = (int) (jsonNumber.doubleValue());
    					dest = parent.getMetaObject(dest_id);
    				}
    				
    			}

    		}});

	}
	
}
