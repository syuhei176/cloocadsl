package com.clooca.webutil.client;

import com.google.gwt.cell.client.AbstractCell;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.clooca.core.client.model.ProjectInfo;


public class ProjectInfoCell extends AbstractCell<ProjectInfo> {

	@Override
	public void render(com.google.gwt.cell.client.Cell.Context context,
			ProjectInfo value, SafeHtmlBuilder sb) {
		  sb.appendHtmlConstant("<table><tr><th>");
		  sb.appendHtmlConstant(
		    SafeHtmlUtils.fromString(value.getName()).asString());
		  sb.appendHtmlConstant("</th><td>");
		  
		  sb.appendHtmlConstant("</td><td>");
		  sb.appendHtmlConstant("</td></tr></table>");
	}

}
