package com.clooca.workbench.client;

import com.clooca.core.client.presenter.ProjectController;
import com.clooca.webutil.client.constant.CloocaConstants;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.MenuBar;
import com.google.gwt.user.client.ui.MenuItem;
import com.google.gwt.user.client.ui.PushButton;

public class MenuPanel {
	 
	ProjectController mProjectController;
	private CloocaConstants constants = GWT.create(CloocaConstants.class);

	private HorizontalPanel mainpanel = new HorizontalPanel();

	  private final Command command = new Command() {
		    public void execute() {
		    }
		  };
		  
	public MenuPanel(ProjectController pc) {
		
		mProjectController = pc;
		
	    final MenuBar menuBarFile = new MenuBar(true);
	    menuBarFile.addItem(new MenuItem("保存", command));
	    menuBarFile.addItem(new MenuItem("すべて保存", command));

	    SafeHtmlBuilder sb = new SafeHtmlBuilder();
	    sb.appendHtmlConstant("<a href=" + "./cgi/logout.cgi" + " link=\"#000055\" vlink=\"#000055\" alink=\"#000055\">ログアウト</a>");
	    menuBarFile.addItem(new MenuItem("Import", command));
	    menuBarFile.addItem(new MenuItem("Export", command));
	    menuBarFile.addItem(sb.toSafeHtml(), command);


	    final MenuBar menuBarEdit = new MenuBar(true);
	    menuBarEdit.addItem(new MenuItem("戻る", command));
	    menuBarEdit.addItem(new MenuItem("進む", command));
	    menuBarEdit.addItem(new MenuItem("削除", command));
	    menuBarEdit.addItem(new MenuItem("検索（未実装）", command));
	    menuBarEdit.addItem(new MenuItem("関連する図の作成", command));
	    menuBarEdit.addItem(new MenuItem("設定", command));

	    final MenuBar menuBarProject = new MenuBar(true);
	    menuBarProject.addItem(new MenuItem(constants.simulation(), command));
	    menuBarProject.addItem(new MenuItem(constants.genaretecode(), command));
	    menuBarProject.addItem(new MenuItem(constants.download(), command));
	    menuBarProject.addItem(new MenuItem("バイナリ生成", command));

	    final MenuBar menuBarDisplay = new MenuBar(true);
	    menuBarDisplay.addItem(new MenuItem("ExeXML", command));
	    menuBarDisplay.addItem(new MenuItem("キャンパスサイズ変更", command));

	    final MenuBar menuBarHelp = new MenuBar(true);
	    menuBarHelp.addItem(new MenuItem(constants.help(), command));
	    menuBarHelp.addItem(new MenuItem("reserved", command));

	    MenuBar main_menupanel;

	    main_menupanel = new MenuBar(false);
	    main_menupanel.addItem(constants.file(), menuBarFile);
	    main_menupanel.addItem(constants.edit(), menuBarEdit);
	    main_menupanel.addItem(constants.project(), menuBarProject);
	    main_menupanel.addItem(constants.view(), menuBarDisplay);
	    main_menupanel.addItem(constants.help(), menuBarHelp);

//	    Image save_img = new Image("images/save.png");
//	    save_img.setPixelSize(24, 24);
	    PushButton save_button = new PushButton("Save");
	    save_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				
			}
			});


	    mainpanel.add(main_menupanel);
	    mainpanel.add(save_button);
	}

	public HorizontalPanel getPanel() {
		return mainpanel;
	}

}
