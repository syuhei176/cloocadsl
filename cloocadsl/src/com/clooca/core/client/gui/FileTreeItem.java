package com.clooca.core.client.gui;

import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.http.client.URL;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.TreeItem;
import com.clooca.webutil.client.RequestGenerator;

public class FileTreeItem extends TreeItem {
	
	String name;
	String content;
	String type;
	String path;
	boolean loaded = false;
	
	static public String projectname;
	
	public FileTreeItem(String name, String content, String path, String type) {
		this.name = name;
		this.content = content;
		this.setText(this.name);
		this.path = path;
		this.type = type;
	}
	
	public FileTreeItem getChild(int i) {
		return (FileTreeItem)super.getChild(i);
	}
	
	public FileTreeItem(JSONValue jsonvalue) {
//		FileTreeItem(jsonvalue);
        JSONArray jsonArray;
        JSONObject jsonObject;
        JSONString jsonString;
        JSONBoolean jsonBoolean;
        JSONNumber jsonNumber;
        
		if((jsonObject = jsonvalue.isObject()) != null) {
			if((jsonString = jsonObject.get("name").isString()) != null) {
				name = jsonString.stringValue();
				this.setText(this.name);
				this.path = name;
			}
			if((jsonString = jsonObject.get("type").isString()) != null) {
				type = jsonString.stringValue();
			}
			if(type.matches("dir")) {
				if((jsonArray = jsonObject.get("list").isArray()) != null) {
					for(int i=0;i < jsonArray.size();i++){
						this.addItem(new FileTreeItem(jsonArray.get(i), this.path));
					}
				}
			}else if(type.matches("file")) {
				if((jsonString = jsonObject.get("content").isString()) != null) {
					this.content = jsonString.stringValue();
				}
			}
		}
	}
	
	public FileTreeItem(JSONValue jsonvalue, String path) {
        JSONArray jsonArray;
        JSONObject jsonObject;
        JSONString jsonString;
        JSONBoolean jsonBoolean;
        JSONNumber jsonNumber;
        
		if((jsonObject = jsonvalue.isObject()) != null) {
			if((jsonString = jsonObject.get("name").isString()) != null) {
				name = jsonString.stringValue();
				this.setText(this.name);
				this.path = path +"/"+ name;
			}
			if((jsonString = jsonObject.get("type").isString()) != null) {
				type = jsonString.stringValue();
			}
			if(type.matches("dir")) {
				if((jsonArray = jsonObject.get("list").isArray()) != null) {
					for(int i=0;i < jsonArray.size();i++){
						this.addItem(new FileTreeItem(jsonArray.get(i), this.path));
					}
				}
			}else if(type.matches("file")) {
				if((jsonString = jsonObject.get("content").isString()) != null) {
					this.content = jsonString.stringValue();
				}
			}
		}

	}
	
	public void refresh() {
		RequestGenerator.send("./cgi/file/tree.cgi", "pname="+projectname+"&path="+URL.encodeQueryString("/"+path), new RequestCallback(){

			@Override
			public void onError(Request request, Throwable exception) {
//				Window.alert(exception.getMessage());
			}

			@Override
			public void onResponseReceived(Request request, Response response) {
//				tree.clear();
				JSONArray files = JSONParser.parseLenient(response.getText()).isArray();
				for(int i=0;i < files.size();i++) {
					addItem(new FileTreeItem(files.get(i), path));
				}
			}});
	}
	
	public void save() {
		RequestGenerator.send("./cgi/file/save.cgi", "pname="+projectname+"&path="+URL.encodeQueryString(path)+"&content="+URL.encodeQueryString(content), new RequestCallback(){

			@Override
			public void onError(Request request, Throwable exception) {
				Window.alert("ファイル保存中のエラー");
			}

			@Override
			public void onResponseReceived(Request request, Response response) {
//				Window.alert("ファイル保存");
			}});
	}
	
	public String getName() {
		return name;
	}
	
	public String getPath() {
		return path;
	}

	
	public String getContent() {
		return content;
	}
	
	public void setContent(String content) {
		this.content = content;
	}

	
	public void loadContent(String content) {
		this.content = content;
		loaded = true;
	}

	
	public boolean isLoaded() {
		return loaded;
	}
	
}
