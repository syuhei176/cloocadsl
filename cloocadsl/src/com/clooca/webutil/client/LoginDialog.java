package com.clooca.webutil.client;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.PasswordTextBox;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.clooca.core.client.model.LoginInfo;


/**
 * 
 * @author Syuhei Hiya
 *
 */
public class LoginDialog extends DialogBox {
	
	LoginDialog parent;
	LoginCallBack mLoginCallBack;
	
    public LoginDialog(LoginCallBack callback){
		mLoginCallBack = callback;
      setText("γ­γ°γ€γ³γ?€γ’γ­γ°");
      parent = this;
      setWidget(new LoginPanel().asWidget());
    }
    
    public interface LoginCallBack {
    	public void onLogin(LoginInfo logininfo);
    }
    
    private class LoginPanel extends Composite  {
    	
    	TextBox username = new TextBox();
    	PasswordTextBox password = new PasswordTextBox();
    	Label message = new Label();
    	
    	public LoginPanel() {
    	      message.setText("γ­γ°γ€γ³γγ¦γγ γγ");
    	      Button okButton = new Button("Login");
    	      Button cancelButton = new Button("Cancel");
    	      
    	      okButton.addClickHandler(new ClickHandler(){
    	        @Override
    	        public void onClick(ClickEvent event) {
	  	        	message.setText("ιδΏ‘δΈ­γ?εΎ?‘γγ γγ");
	  	        	
	  	        	RequestGenerator.send("./cgi/login.cgi",
	  	        			"username="+username.getText()+"&passward="+password.getText(),
	  	        			new RequestCallback(){

								@Override
								public void onError(Request request,
										Throwable exception) {
	    	    	  	        	message.setText("error");
								}

								@Override
								public void onResponseReceived(Request request,
										Response response) {
	    	    	  	        	message.setText(response.getText());
									LoginInfo loginInfo = new LoginInfo(JSONParser.parseLenient(response.getText()));
									if(loginInfo.isLoggedIn()){
										StorageManager session = new StorageManager();
										session.set("username", loginInfo.getUsername());
										hide();
										if(mLoginCallBack != null) mLoginCallBack.onLogin(loginInfo);
									}else{
		    	    	  	        	message.setText("γ¦γΌγΆεγΎγγ?γγΉγ―γΌγγιγγΎγγ?");
									}
								}});

    	        }
    	      });
    	      cancelButton.addClickHandler(new ClickHandler(){
    	          @Override
    	          public void onClick(ClickEvent event) {
    	          	hide();
    	          }
    	        });
    	      
    	      /*
    	       * Cookieγγ»γ?γγ
    	       */
				StorageManager storage = new StorageManager();
				String uname = storage.get("username");
    			if(uname != null) {
    				username.setText(uname);
    			}


    	      VerticalPanel panel1 = new VerticalPanel();
    	      HorizontalPanel panel2 = new HorizontalPanel();
    	      panel1.add(message);
    	      panel1.add(username);
    	      panel1.add(password);
    	      panel2.add(okButton);
    	      panel2.add(cancelButton);
    	      panel1.add(panel2);
    	      this.initWidget(panel1);
    	}

    }
    
}