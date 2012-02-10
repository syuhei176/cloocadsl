package com.clooca.webutil.client;

import java.util.Date;

import com.google.gwt.storage.client.Storage;
import com.google.gwt.user.client.Cookies;

public class StorageManager {
	
	Storage session;
	boolean temp = true;
	
	public StorageManager() {
		Storage session = Storage.getSessionStorageIfSupported();
        if(session == null){
        	
        }
	}
	
	public StorageManager(boolean temp) {
		this.temp = temp;
		if(temp){
			session = Storage.getSessionStorageIfSupported();
		}else{
			session = Storage.getLocalStorageIfSupported();
		}
        if(session == null){
        	
        }
	}

	
	static public StorageManager GetTempStorage() {
		return new StorageManager(true);
	}
	
	static public StorageManager GetPersistentStorage() {
		return new StorageManager(false);
	}

	
	public String get(String key) {
        if(session != null){
        	String str = session.getItem("projectname");
        	if(str != null) return mydecode(str);
        	return null;
        }else{
        	String str = Cookies.getCookie(key);
        	if(str != null) return mydecode(str);
        	return null;
        }
	}
	
	public void set(String key, String data) {
        if(session != null){
    		session.setItem(key, myencode(data));
        }else{
        	if(temp) {
            	Cookies.setCookie(key, myencode(data));
        	}else{
        		Date now = new Date();
        		long nowLong = now.getTime();
        		nowLong = nowLong + (1000 * 60 * 60 * 24 * 7);
        		now.setTime(nowLong);
            	Cookies.setCookie(key, myencode(data), now);
        	}
        }
	}
	
	public boolean has_key(String key) {
        if(session != null){
        	for(int i=0;i < session.getLength();i++) {
        		if(key.matches(session.key(i))) return true;
        	}
        }else{
        	
        }
        return false;
	}
	
	static public String myencode(String input) {
		String output = "";
		for(int i=0;i < input.length();i++) {
			char c = input.charAt(i);
			if(c == 'e') {
				output += "x";
			}else if(c == 'a') {
				output += "zx";
			}else if(c == 't') {
				output += "zz";
			}else if(c == 'o') {
				output += "yx";
			}else if(c == 'i') {
				output += "yzx";
			}else if(c == 'E') {
				output += "yzzx";
			}else if(c == 'A') {
				output += "yzzz";
			}else if(c == 'T') {
				output += "yyx";
			}else if(c == 'O') {
				output += "yyzx";
			}else if(c == 'I') {
				output += "yyzz";
			}else if(c == 'x') {
				output += "yyyx";
			}else if(c == 'y') {
				output += "yyyz";
			}else if(c == 'z') {
				output += "yyyy";
			}else if(c == 'c') {
				output += "s";
			}else if(c == 'g') {
				output += "c";
			}else if(c == 'j') {
				output += "g";
			}else if(c == 'k') {
				output += "j";
			}else if(c == 'p') {
				output += "k";
			}else if(c == 'r') {
				output += "p";
			}else if(c == 's') {
				output += "r";
			}else{
				output += c;
			}
		}
		return output;
	}

	static public String mydecode(String input) {
		String output = "";
		int state = 0;
		for(int i=0;i < input.length();i++) {
			char c = input.charAt(i);
			if(state == 0) {
				if(c == 'x') {
					output += "e";
				}else if(c == 'z') {
					state = 1;
				}else if(c == 'y') {
					state = 2;
				}else{
					if(c == 's') {
						output += "c";
					}else if(c == 'c') {
						output += "g";
					}else if(c == 'g') {
						output += "j";
					}else if(c == 'j') {
						output += "k";
					}else if(c == 'k') {
						output += "p";
					}else if(c == 'p') {
						output += "r";
					}else if(c == 'r') {
						output += "s";
					}else{
						output += c;
					}
				}
			}else if(state == 1){	//z
				if(c == 'x') {
					output += "a";
					state = 0;
				}else if(c == 'z') {
					output += "t";
					state = 0;
				}else{
					output += "ERROR";
				}
			}else if(state == 2){	//y
				if(c == 'x') {
					output += "o";
					state = 0;
				}else if(c == 'z') {
					state = 3;
				}else if(c == 'y') {
					state = 5;
				}else{
					output += "ERROR";
				}
			}else if(state == 3){	//yz
				if(c == 'x') {
					output += "i";
					state = 0;
				}else if(c == 'z') {
					state = 4;
				}else{
					output += "ERROR";
				}
			}else if(state == 4){	//yzz
				if(c == 'x') {
					output += "E";
					state = 0;
				}else if(c == 'z') {
					output += "A";
					state = 0;
				}else{
					output += "ERROR";
				}
			}else if(state == 5){	//yy
				if(c == 'x') {
					output += "T";
					state = 0;
				}else if(c == 'y') {
					state = 7;
				}else if(c == 'z') {
					state = 6;
				}else{
					output += "ERROR";
				}
			}else if(state == 6){	//yyz
				if(c == 'x') {
					output += "O";
					state = 0;
				}else if(c == 'z') {
					output += "I";
					state = 0;
				}else{
					output += "ERROR";
				}
			}else if(state == 7){	//yyy
				if(c == 'x') {
					output += "x";
					state = 0;
				}else if(c == 'y') {
					output += "z";
					state = 0;
				}else if(c == 'z') {
					output += "y";
					state = 0;
				}else{
					output += "ERROR";
				}
			}
		}
		return output;
	}

}
