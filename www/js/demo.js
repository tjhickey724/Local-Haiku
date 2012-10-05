// Parse.initialize("....",".....");  
// this is where the parse key info goes...
// you need to go to parse.com, create an account and copy that info here!!!

$("#index").live("pageinit", function(event){
	$("#register").click(function(){
		$.mobile.changePage( "#registerpage", { transition: "slideup"} );
	});
	$("#login").click(function(){
		$.mobile.changePage( "#loginpage", { transition: "slideup"} );
	});
	$("#logoutLink").click(function(){
		Parse.User.logOut();
		$("#status", page).html("you have successfully logged off");
	});
	$("#viewLink").click(function(){
		$.mobile.changePage( "#viewPage", { transition: "slideup"} );
	});
	$("#composeLink").click(function(){
		$.mobile.changePage( "#composePage", { transition: "slideup"} );
	});

	var page = $("#index");
	var currentUser = Parse.User.current();
	if (currentUser) {
		$("#user",page).html(currentUser.getUsername());
	} else {
		$("#user",page).html("no one is logged in");
		return;
	}
});

$("#composePage").live("pageinit", function(event) {
	var page = $("#composePage");
	var currentUser = Parse.User.current();
	
	if (currentUser) {
		$("#user",page).html(currentUser.getUsername());
	} else {
		$("#user",page).html("You must be logged in to compose a haiku");
		return;
	}
	
	
	$("#publish",page).live("click",function(e) {
		var currentUser = Parse.User.current();
		var Haiku = Parse.Object.extend("Haiku");
	    var haikuObject = new Haiku();
	
		haikuObject.set("title",$("#title",page).val());
		haikuObject.set("descr",$("#descr",page).val());
		haikuObject.set("poem",$("#poem",page).val());
		haikuObject.set("parent",currentUser);
		
	    haikuObject.save({
	      success: function(object) {
			$("#status",page).html("success!");
			$.mobile.changePage("#index",{transition:"slideup"});
	      },
	      error: function(model, error) {
			$("#status",page).html("error is "+error);
	        $(".error",page).show();
	      }
	    });			
        $("#status",page).html("saved TestObject");	          
		e.preventDefault();
	});
});

$("#viewPage").live("pageinit", function(event){
	var page = $("#viewPage");
	updateviewPage(page);
});


function updateviewPage(page) {
// this retrieves and displays the info about local poems
	var currentUser = Parse.User.current();
	
	if (currentUser) {
		$("#user",page).html(currentUser.getUsername());
	} else {
		$("#user",page).html("no one is logged in");
		return;
	}
	
	var haiku = Parse.Object.extend("Haiku");
	var query = new Parse.Query(haiku);
	//query.equalTo("parent",currentUser);
	query.find({
		success: function(haikus){
			var thetime = Date();
			var results="";
			for (i =0; i<haikus.length; i++) {
			poem = haikus[i];
			var title = poem.get("title");
			var descr = poem.get("descr");
			var poem = poem.get("poem");
			results = results + 
			"\n<li>"
			+"<h1>"+title+"</h1>"
			+"<span>["+descr+"]</span>"
			+"<pre class='haiku'>"+poem+"</pre>";
			}
			results = results+"\n </ul>";
			$("#thetime",page).html(thetime);
			$("#poemList",page).html(results);
			$("#poemList",page).listview("refresh");
			
		},
		error: function(object,error){
			// some error....
			$("#status",page).text("found some error!");
		}

	});	
}


$("#registerpage").live("pageinit", function(event) {
	var page = $("#registerpage");

	var currentUser = Parse.User.current();
	if (currentUser) {
		$("#status",page).html("The current user is "+currentUser);
	} else {
		$("#status",page).html("no one is logged in ... ");
	}

	$("#registerLink").live("click",function(e) {
       	var user = new Parse.User();
		user.set("username",$("#username",page).val());
		user.set("email",$("#email",page).val());
		user.set("password",$("#password",page).val());
		user.signUp(null, {
		  success: function(user) {
		    // Hooray! Let them use the app now.
			alert("Congratulations! You are now a registered user!!"
			 +"username="+$("#username",page).val()
			 +" and pw="+$("#password",page).val()  );
		  },
		  error: function(user, error) {
		    // Show the error message somewhere and let the user try again.
		    alert("Error: " + error.code + " " + error.message);
		  }
		});
	});
	

	
});


$("#loginpage").live("pageinit", function(event) {
	var page = $("#loginpage");

	var currentUser = Parse.User.current();
	Parse.User.logOut();
	if (currentUser) {
		$("#status",page).html("The current user is "+currentUser.getUsername());
	    // do stuff with the user
	} else {
		$("#status",page).html("no one is logged in ... ");
	    // show the signup or login page
	}
	
	$("#loginLink").live("click",function(e) {
		var myname =  $("#username",page).val();
		var mypass =  $("#password",page).val();
		
		Parse.User.logIn(myname, mypass, {
		  success: function(user) {
		    // Do stuff after successful login.
		     alert("You are now logged in "+user);
			var currentUser = Parse.User.current();
			if (currentUser) {
				$("#status",page).html("The current user is "+currentUser);
			    // do stuff with the user
			} else {
				$("#status",page).html("no one is logged in ... ");
			    // show the signup or login page
			}
		    $.mobile.changePage( "#index", { transition: "slideup"} );
		
		  },
		  error: function(user, error) {
		    // The login failed. Check error to see why.
		     alert("There was an error"+error +" myname="+myname+" mypass="+mypass);
		  }
		});
	});
	

	
});




