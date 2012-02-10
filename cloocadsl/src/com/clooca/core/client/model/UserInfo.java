package com.clooca.core.client.model;

import java.io.Serializable;

import com.google.gwt.json.client.*;

@SuppressWarnings("serial")
public class UserInfo implements Serializable {

	private long id;
	private String username;
	private String email;
	private boolean role;

	public UserInfo() {
		
	}

	public UserInfo(JSONValue jsonvalue) {
        JSONArray jsonArray;
        JSONObject jsonObject;
        JSONString jsonString;
        JSONBoolean jsonBoolean;
        JSONNumber jsonNumber;
        
		if((jsonObject = jsonvalue.isObject()) != null) {
			
			if((jsonNumber = jsonObject.get("id").isNumber()) != null) {
				id = (long) (jsonNumber.doubleValue());
			}
			if((jsonString = jsonObject.get("username").isString()) != null) {
				username = jsonString.stringValue();
			}
			if((jsonString = jsonObject.get("email").isString()) != null) {
				email = jsonString.stringValue();
			}
			if((jsonNumber = jsonObject.get("role").isNumber()) != null) {
				if(jsonNumber.doubleValue() == 1) role = true;
				else role = false;
			}
		}
	}
	
	public void setUsername(String username) {
		this.username = username;
	}

	public String getUsername() {
		return username;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getEmail() {
		return email;
	}

	public void setRole(boolean role) {
		this.role = role;
	}

	public boolean isRole() {
		return role;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	

	
}