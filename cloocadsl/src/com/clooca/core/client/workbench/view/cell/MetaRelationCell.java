package com.clooca.core.client.workbench.view.cell;

import com.clooca.core.client.model.gopr.metaelement.MetaObject;
import com.clooca.core.client.model.gopr.metaelement.MetaRelation;
import com.google.gwt.cell.client.AbstractCell;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;

public class MetaRelationCell extends AbstractCell<MetaRelation> {

	@Override
	public void render(com.google.gwt.cell.client.Cell.Context context,
			MetaRelation value, SafeHtmlBuilder sb) {
		  sb.appendHtmlConstant("<table><tr><th>");
		  sb.appendHtmlConstant(SafeHtmlUtils.fromString(""+value.id).asString());
		  sb.appendHtmlConstant("</th><td>");
		  sb.appendHtmlConstant(SafeHtmlUtils.fromString(value.name).asString());
		  sb.appendHtmlConstant("</td><td>");
		  sb.appendHtmlConstant(SafeHtmlUtils.fromString(""+value.ve.version).asString());
		  sb.appendHtmlConstant("</td><td>");
		  sb.appendHtmlConstant(SafeHtmlUtils.fromString(value.ve.ver_type).asString());
		  sb.appendHtmlConstant("</td></tr></table>");
	}

}
