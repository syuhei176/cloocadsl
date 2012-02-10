package com.clooca.webutil.client;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author syuhei
 *
 */
public class Path {
	
	/**
	 * "name/name"
	 */
	String fullpath;
	List<String> path_strs = new ArrayList<String>();
	
	public Path(String path) {
		fullpath = path;
		String strs[] = fullpath.split("/");
		for(int i=0;i < strs.length;i++) {
			path_strs.add(strs[i]);
		}
	}
	
	public boolean maches(Path path) {
		return fullpath.matches(path.fullpath);
	}
	
	public String getFileName() {
		return path_strs.get(path_strs.size()-1);
	}
	
	public String getFilePath() {
		String path = "";
		for(int i=0;i < path_strs.size() - 1;i++) {
			path += path_strs.get(i) + "/";
		}
		return path;
	}
	
	public String getParentPath() {
		String path = "";
		for(int i=0;i < path_strs.size() - 2;i++) {
			path += path_strs.get(i) + "/";
		}
		if(path_strs.size() >= 2) path += path_strs.get(path_strs.size() - 2);
		return path;
	}

	
	public List<String> getFilePathList() {
		return path_strs;
	}
	
	public String getFullPath() {
		return fullpath;
	}
}
