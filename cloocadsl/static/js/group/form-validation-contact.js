jQuery(document).ready(function($) {

	// hide messages 
	$("#error").hide();
	$("#success").hide();
	
	// on submit...
	$("#registerForm #submit").click(function() {
		$("#error").hide();
		
		//required:
		
		//name
		var name = $("input#name").val();
		if(uname == ""){
			$("#error").fadeIn().text("名前が必要です。");
			$("input#name").focus();
			return false;
		}
		
		// email
		var email = $("input#email").val();
		if(email == ""){
			$("#error").fadeIn().text("emailアドレスが必要です。");
			$("input#email").focus();
			return false;
		}
		
		var content = $("input#content").val();
		if(content == ""){
			$("#error").fadeIn().text("内容が必要です。");
			$("input#content").focus();
			return false;
		}
		
		url = $("#registerForm").attr( 'action' );
		
		// data string
		var dataString = 'name='+ name
						+ '&email=' + email
						+ '&content=' + content;
		
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

