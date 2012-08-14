function AccountInfo(id) {
	this.id = id;
	/*
	email:key
	password
	fullname
	last_login_date:Date
	registration_date:Date
	updated_date:Date
	*/
}

/**
 * シングルトン
 * @returns
 */
function AccountManager() {
	/*
	 * コンストラクタでサーバからアカウント情報を取得する。
	 */
	this.myaccount = null;
}

AccountManager.prototype.getMyAccount = function() {
	return this.myaccount;
}

id:int
tool_key:varchar[32]
name:string
created_date:Date
updated_date:Date
head_version:int
metametamodel_version:int
detail:tinytext
visibillity:int