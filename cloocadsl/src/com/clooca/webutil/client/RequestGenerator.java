package com.clooca.webutil.client;

import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;

public class RequestGenerator {
	static public void send(String url, String requestData, RequestCallback rc) {
		final RequestBuilder requestBuilder = new RequestBuilder(RequestBuilder.POST, url);
//		requestBuilder.setHeader( "Content-Type", "application/json" );
		requestBuilder.setHeader( "Content-Type", "application/x-www-form-urlencoded" );
//		requestBuilder.setHeader( "Content-Length", String.valueOf(requestData.length()));
		
		requestBuilder.setRequestData(requestData);
		requestBuilder.setCallback(rc);
		try {
			requestBuilder.send();
		} catch (RequestException e) {
			e.printStackTrace();
		}

	}
	
}
