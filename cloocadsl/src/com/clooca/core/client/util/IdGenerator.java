package com.clooca.core.client.util;

public class IdGenerator {
 
	private static int count = 0;
	private static int idcount = 0;
	 
	public static String getNewId() {
		count++;
		return "" + count;
	}
	
	public static int getNewLongId() {
		idcount++;
		return idcount;
	}

}
 
