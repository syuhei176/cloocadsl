package com.clooca.core.client.util;

public class Converter {
	
	static public String convert(String input) {
		String output = "";
		for(int i=0;i < input.length();i++) {
			if((input.charAt(i) >= 'a' && input.charAt(i) <= 'z') ||
					(input.charAt(i) >= 'A' && input.charAt(i) <= 'Z') ||
					(input.charAt(i) >= '0' && input.charAt(i) <= '9') ||
					(input.charAt(i) == '_')) {
				output += input.charAt(i);
			}else{
				output += "j" + Integer.toHexString(input.charAt(i));
			}
		}
		return output;
	}
	
	static public String decode_action_language(String input) {
		return input.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
	}

	static public String convert_action_language(String input) {
		String output = "";
		for(int i=0;i < input.length();i++) {
			if((input.charAt(i) >= 'a' && input.charAt(i) <= 'z') ||
					(input.charAt(i) >= 'A' && input.charAt(i) <= 'Z') ||
					(input.charAt(i) >= '0' && input.charAt(i) <= '9') ||
					(input.charAt(i) == '_') ||
					(input.charAt(i) == '\n') ||
					(input.charAt(i) == '\r') ||
					(input.charAt(i) == '\t') ||
					(input.charAt(i) == ' ') ||
					(input.charAt(i) == '.') ||
					(input.charAt(i) == ',') ||
					(input.charAt(i) == '=') ||
					(input.charAt(i) == '+') ||
					(input.charAt(i) == '-') ||
					(input.charAt(i) == '*') ||
					(input.charAt(i) == '/') ||
					(input.charAt(i) == '%') ||
					(input.charAt(i) == ':') ||
					(input.charAt(i) == '(') ||
					(input.charAt(i) == ')') ||
					(input.charAt(i) == '{') ||
					(input.charAt(i) == '}') ||
					(input.charAt(i) == '[') ||
					(input.charAt(i) == ']') ||
					(input.charAt(i) == '\"') ||
					(input.charAt(i) == ';')) {
				output += input.charAt(i);
			}else if(input.charAt(i) == '<'){
				output += "&lt;";
			}else if(input.charAt(i) == '>'){
				output += "&gt;";
			}else if(input.charAt(i) == '&'){
				output += "&amp;";
			}else{
				output += "j" + Integer.toHexString(input.charAt(i));
			}
		}
		return output;
	}
	
	static public String decode_xml(String input) {
		return input.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
	}

	static public String convert_xml(String input) {
		return input.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("&", "&amp;");
	}

}
