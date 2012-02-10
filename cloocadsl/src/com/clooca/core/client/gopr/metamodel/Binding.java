package com.clooca.core.client.gopr.metamodel;

import com.clooca.core.client.gopr.element.ModelElement;
import com.clooca.webutil.client.RequestGenerator;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;

public class Binding extends MetaElement {
	MetaDiagram parent;
	MetaObject src;
	MetaObject dest;
	
	public Binding(int id, MetaObject src, MetaObject dest) {
		super(id);
		this.src = src;
		this.dest = dest;
	}
	
	public Binding(int id, MetaDiagram parent) {
		super(id);
		this.parent = parent;
		load(id);
	}
	
	public MetaObject getSrc() {
		return src;
	}

	public MetaObject getDest() {
		return dest;
	}

	@Override
	public ModelElement getInstance() {
		// TODO Auto-generated method stub
		return null;
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
    			JSONObject jsonObject = JSONParser.parseLenient(response.getText()).isObject();
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
