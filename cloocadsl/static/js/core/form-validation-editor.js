jQuery(document).ready(function($) {

	// hide messages 
	$("#error").hide();
	$("#success").hide();
	
	// on submit...
	$("#registerForm #submit").click(function() {
		$("#error").hide();
		
		//required:
		
		//name
		var uname = $("input#uname").val();
		if(uname == ""){
			$("#error").fadeIn().text("ユーザ名が必要です。");
			$("input#uname").focus();
			return false;
		}
		
		// email
		var email = $("input#email").val();
		if(email == ""){
			$("#error").fadeIn().text("emailアドレスが必要です。");
			$("input#email").focus();
			return false;
		}
		
		var passwd = $("input#passwd").val();
		if(passwd == ""){
			$("#error").fadeIn().text("パスワードが必要です。");
			$("input#passwd").focus();
			return false;
		}
		url = $("#registerForm").attr( 'action' );
		
		// data string
		var dataString = 'username='+ uname
						+ '&email=' + email
						+ '&license_type=free'
						+ '&password=' + passwd;
		
		$.ajax({
			type:"POST",
			url: url,
			data: dataString,
			dataType: 'json',
			success: function(data){
				 if(data) {
					 	$("#success").fadeIn();
					 	$("#registerForm").fadeOut();
				 }else{
						$("#error").fadeIn().text("既に登録されています。");
				 }
			}
		});
	});
	
    return false;
});

