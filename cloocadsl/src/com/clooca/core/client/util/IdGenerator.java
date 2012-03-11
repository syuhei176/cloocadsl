package com.clooca.core.client.util;

public class IdGenerator {
 
	private static int count = 0;
	private static int idcount = 0;
	private static int offset = 0;
	 
	public static String getNewId() {
		count++;
		return "" + count;
	}
	
	public static int getNewLongId() {
		idcount++;
		return idcount;
	}

	public static void setOffset(int i) {
		if(offset < i) {
			offset = i;
			count = offset;
			idcount = offset;
		}
	}

}
 
