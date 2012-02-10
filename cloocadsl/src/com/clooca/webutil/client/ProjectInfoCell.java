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
		    SafeHtmlUtils.fromString(value.getProjectname()).asString());
		  sb.appendHtmlConstant("</th><td>");
		  
		  if(value.getBelongLesson() <= 0) {
			  sb.appendHtmlConstant(SafeHtmlUtils.fromString("自�??プロジェク�?").asString());
		  }else{
			  sb.appendHtmlConstant(SafeHtmlUtils.fromString("授業プロジェク�"+value.getBelongLesson()).asString());
		  }
		  sb.appendHtmlConstant("</td><td>");
		  sb.appendHtmlConstant(SafeHtmlUtils.fromString(value.getType()).asString());
		  sb.appendHtmlConstant("</td></tr></table>");
	}

}
