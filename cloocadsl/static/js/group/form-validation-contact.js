jQuery(document).ready(function($) {

	// hide messages 
	$("#error").hide();
	$("#success").hide();
	
	// on submit...
	$("#contactForm #submit").click(function() {
		$("#error").hide();
		
		//required:
		
		//name
		var name = $("input#name").val();
		if(name == ""){
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
		
		var type = $("select#type").val();
		
		var content = $("textarea#content").val();
		if(content == ""){
			$("#error").fadeIn().text("内容が必要です。");
			$("textarea#content").focus();
			return false;
		}
		
		url = $("#contactForm").attr( 'action' );
		
		// data string
		var dataString = 'name='+ name
						+ '&email=' + email
						+ '&type=' + type
						+ '&content=' + content;
		
		$.ajax({
			type:"POST",
			url: url,
			data: dataString,
			dataType: 'json',
			success: function(data){
				 if(data) {
					 	$("#success").fadeIn();
					 	$("#contactForm").fadeOut();
				 }else{
						$("#error").fadeIn().text("エラー");
				 }
			}
		});
	});
	
    return false;
});

