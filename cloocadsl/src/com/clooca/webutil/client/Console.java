package com.clooca.webutil.client;

public class Console {
	  public static final native String log(String text) /*-{ $wnd.console.log(text); }-*/;
	  public static final native String error(String text) /*-{ $wnd.console.error(text); }-*/;
}
