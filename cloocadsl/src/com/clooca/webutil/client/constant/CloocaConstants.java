package com.clooca.webutil.client.constant;

import com.google.gwt.i18n.client.Constants;

public interface CloocaConstants  extends Constants {
	  @DefaultStringValue("Please sign in to your Google Account.")
	  String loginmessage();

	  @DefaultStringValue("Generate")
	  String genaretecode();

	  @DefaultStringValue("Simulation")
	  String simulation();

	  @DefaultStringValue("Admin")
	  String admin();
	  
	  @DefaultStringValue("Save")
	  String overwride();
	  
	  /*
	   * Menu
	   */

	  @DefaultStringValue("File")
	  String file();
	  @DefaultStringValue("Edit")
	  String edit();
	  @DefaultStringValue("Project")
	  String project();
	  @DefaultStringValue("View")
	  String view();
	  @DefaultStringValue("Help")
	  String help();
	  
	  /*
	   * 
	   */
	  @DefaultStringValue("New")
	  String createnew();

	  @DefaultStringValue("Download")
	  String download();

}
