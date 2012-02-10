package com.clooca.core.client.model;

import java.io.Serializable;

import com.google.gwt.json.client.*;
import com.google.gwt.user.client.Window;
import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.XMLParser;
import com.google.gwt.xml.client.impl.DOMParseException;

@SuppressWarnings("serial")
public class LoginInfo implements Serializable {

	private boolean loggedIn = false;
	private boolean lessonflg = false;
	private Long id;
	private String username;
	private int role;
	private String email;
//	private String detail;
	UserDetail userdetail;
	
	public LoginInfo(JSONValue jsonvalue) {
        JSONArray jsonArray;
        JSONObject jsonObject;
        JSONString jsonString;
        JSONBoolean jsonBoolean;
        JSONNumber jsonNumber;
        
		if((jsonObject = jsonvalue.isObject()) != null) {
			if((jsonBoolean = jsonObject.get("loggedin").isBoolean()) != null) {
				loggedIn = jsonBoolean.booleanValue();
			}
			if((jsonNumber = jsonObject.get("id").isNumber()) != null) {
				setId((long)jsonNumber.doubleValue());
			}
			if((jsonString = jsonObject.get("username").isString()) != null) {
				username = jsonString.stringValue();
			}
			if((jsonString = jsonObject.get("email").isString()) != null) {
				email = jsonString.stringValue();
			}
			if((jsonBoolean = jsonObject.get("lessonflg").isBoolean()) != null) {
				setLessonflg(jsonBoolean.booleanValue());
			}
			if((jsonNumber = jsonObject.get("role").isNumber()) != null) {
				role = (int) jsonNumber.doubleValue();
			}
			if((jsonString = jsonObject.get("detail").isString()) != null) {
				String detail = jsonString.stringValue();
				userdetail = new UserDetail();
				userdetail.fromXML(detail);
			}
		}
	}

  public boolean isLoggedIn(){
    return loggedIn;
  }
  
  public void setLoggedIn(boolean loggedIn){
    this.loggedIn = loggedIn;
  }
  
  
  public String getEmail(){
    return email;
  }
  
  public void setEmail(String email){
    this.email = email;
  }
  	
	public String getUsername() {
		return username;
	}
	
	public void setLessonflg(boolean lessonflg) {
		this.lessonflg = lessonflg;
	}

	public boolean isLessonflg() {
		return lessonflg;
	}
	
	public int getRole() {
		return role;
	}
	
	public boolean isAdmin() {
		if(role == 1) return true;
		return false;
	}

	public Long getUserId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public UserDetail getDetail() {
		return userdetail;
	}
	
	public class UserDetail {
		
		private String belong;
		
		public UserDetail() {
			
		}
		
		public void fromXML(String xml) {
			Document doc = null;
			try {
				doc = XMLParser.parse(xml);
			}catch(DOMParseException e) {
				belong = "";
				doc = XMLParser.parse(toXML());
			} finally {
				NodeList nl = doc.getChildNodes();
				for(int i = 0;i < nl.getLength();i++) {
					if(nl.item(i).getNodeName().matches("Detail")) {
						parseDetail(nl.item(i));
					}
				}
			}
		}
		
		private void parseDetail(Node node) {
			NodeList nl = node.getChildNodes();
			for(int i = 0;i < nl.getLength();i++) {
				if(nl.item(i).getNodeName().matches("Belong")) {
					NodeList nl2 = nl.item(i).getChildNodes();
					for(int ii = 0;ii < nl2.getLength();ii++) {
						if(nl2.item(ii).getNodeType() == com.google.gwt.xml.client.Node.TEXT_NODE) {
							this.belong = nl2.item(ii).getNodeValue();
						}
					}

				}
			}

		}
		
		public String toXML() {
			String detail = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
			detail += "<Detail>";
			detail += "<Belong>"+this.belong+"</Belong>";
			detail += "</Detail>";
			return detail;
		}
		
		public void setBelong(String belong) {
			this.belong = belong;
		}
		
		public String getBelong() {
			return belong;
		}
	}
	
}