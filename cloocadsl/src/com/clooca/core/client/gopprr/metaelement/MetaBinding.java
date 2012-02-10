package com.clooca.core.client.gopprr.metaelement;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.gopprr.element.*;
import com.clooca.webutil.client.RequestGenerator;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;

public class MetaBinding extends MetaElement {
	long id;
	MetaRelation meta_relation;
	MetaDiagram parent;
	List<MetaRole> meta_role;
	
	public MetaBinding(MetaDiagram parent, int id, MetaRelation metarelation, List<MetaRole> meta_role) {
		super(id);
		this.parent = parent;
		this.meta_relation = metarelation;
//		parent.getMetaRelations();
//		parent.getMetaRoles()
		this.meta_role = meta_role;
	}
	
	public MetaBinding(MetaDiagram parent, int id) {
		super(id);
		this.parent = parent;
		load(id);
	}
	
	public MetaRelation getMetarelation() {
		return meta_relation;
	}

	public List<MetaRole> getMetaRoles() {
		return meta_role;
	}

	@Override
	public ModelElement getInstance() {
		return new Binding(this);
	}
	
	public void load(int id) {
      	RequestGenerator.send("./cgi-bin/core/metabinding.cgi", "id="+id, new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			JSONObject jsonObject = JSONParser.parseLenient(response.getText()).isObject();
    	        JSONArray jsonArray;
    	        JSONString jsonString;
    	        JSONNumber jsonNumber;
    	        
    			if((jsonObject = jsonObject.isObject()) != null) {
    				
    				if((jsonNumber = jsonObject.get("metarelation_id").isNumber()) != null) {
    					int metarelation_id = (int) jsonNumber.doubleValue();
    					meta_relation = parent.getMetaRelation(metarelation_id);
    				}
    				
    				if((jsonArray = jsonObject.get("roles").isArray()) != null) {
    					meta_role = new ArrayList<MetaRole>();
    					for(int i=0;i < jsonArray.size();i++) {
            				if((jsonNumber = jsonArray.get(i).isNumber()) != null) {
            					int role_id = (int) jsonNumber.doubleValue();
            					meta_role.add(parent.getMetaRole(role_id));
            				}
    					}
    				}

    				
    			}

    		}});

	}
	
}
