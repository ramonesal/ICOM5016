
//Global variables

var currentSignedIn = "";
var currentCategory = {};
var currentProducts = {};
var selectedProduct = {};
var currentUser = {};
var view = 1;
var shoppingCartIDs = new Array();
var myBidHistory = {};
var currentBid = {};


//adds a product to the cart
function addToCart(){
    shoppingCartIDs.push(selectedProduct);
    alert("The product was added to your shopping cart!");
}

$(document).on('pagebeforeshow', "#cars", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/ClassDemo4Srv/cars",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var carList = data.cars;
			var len = carList.length;
			var list = $("#cars-list");
			list.empty();
			var car;
			alert("code here1");
			for (var i=0; i < len; ++i){
				car = carList[i];
				list.append("<li><a>" + 
					"<h2>" + car.cbrand + " " + car.cmodel +  "</h2>" + 
					"<p><strong> Year: " + car.cyear + "</strong></p>" + 
					"<p>" + car.cdesc + "</p>" +
					"<p class=\"ui-li-aside\"></p>" +
					"</a></li>");
			}
			list.listview("refresh");	
			alert("code here2");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});


function removeFromCart(id){
	document.location.href = "#cart_page";

	for(var i=0; i < shoppingCartIDs.length; i++) {
	
		if(shoppingCartIDs[i].id == id){
			shoppingCartIDs.splice(i,1);
			break;
		}
			//shoppingCartIDs.pop();

	}
	
	  var productList = shoppingCartIDs;
      var len = productList.length;
	  var list = $("#cartlist");
            list.empty();
            var product;
            for (var i=0; i < len; ++i){
                product = productList[i];
               list.append("<li><a onclick=viewProduct(" + product.id + ")>" + 
					"<h2>" + product.pName + " " + product.brand +  "</h2>" + "<img src="+product.photo+" />" + 
					"<p>" + product.model + "</p>" +
					"<p><strong> Condition: </strong></p>" + 
					"<p class=\"ui-li-aside\">" + "$" + product.iPrice + " <br>"+ "$" + product.bPrice+ "</p>" +
					"</a><a onclick=removeFromCart(" + product.id + ") data-icon=remove></a></li>");
            }
            list.listview("refresh");    
	$.mobile.navigate("#cart_page");
}


//shows the list of products in your cart
$(document).on('pagebeforeshow', "#cart_page", function( event, ui ) {
			$.mobile.changePage.defaults.allowSamePageTransition = true;
            var productList = shoppingCartIDs;
            var len = productList.length;
            var list = $("#cartlist");
            list.empty();
            var product;
            for (var i=0; i < len; ++i){
                product = productList[i];
               list.append("<li><a onclick=viewProduct(" + product.id + ")>" + 
					"<h2>" + product.pName + " " + product.brand +  "</h2>" + "<img src="+product.photo+" />" + 
					"<p>" + product.model + "</p>" +
					"<p><strong> Condition: </strong></p>" + 
					"<p class=\"ui-li-aside\">" + "$" + product.iPrice + " <br>"+ "$" + product.bPrice+ "</p>" +
					"</a><a onclick=removeFromCart(" + product.id + ") data-icon=remove></a></li>");
            }
            list.listview("refresh");    
});




//shows personal info of the user
$(document).on('pagebeforeshow', "#profile_page", function( event, ui ) {
	console.log("Jose");
	

    var list1 = $("#adress_user_profile");
    list1.empty();
    list1.append(currentUser.billingAddress);

    var list3 = $("#name_user_profile");
    list3.empty();
    list3.append(currentUser.firstname + " " + currentUser.lastname);

 

	
});

//browsing categories
function Browse(categoryID){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/categories2/" + categoryID,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			currentCategory = data.categories;
			currentProducts = data.products;
			$.mobile.loading("hide");
			$.mobile.navigate("#browse_view"+ view);
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Category not found.");
			}
			else {
				alert("Internal Server Error.");
			}
		}
	});
}

//viewing bid history
function viewBidHistory(){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/bidHistory",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			myBidHistory = data.bids;
			$.mobile.loading("hide");
			$.mobile.navigate("#bid_history");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Category not found.");
			}
			else {
				alert("Internal Server Error.");
			}
		}
	});
}

//creates te browsing categories
$(document).on('pagebeforeshow', "#browse_index", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/categoriesTest",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var categoriesList = data.categories;
			var len = categoriesList.length;
			var list = $("#myListView");
			list.empty();
			var category;
			for (var i=0; i < len; ++i){
				category = categoriesList[i];
				list.append("<li><a onclick=Browse(" + category.cid + ")>" + category.cname + "</a></li>");
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

//view product
function viewProduct(id){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/product/" + id,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			selectedProduct = data.product;
			alert(selectedProduct.pname);
			alert("success kid!!!!!!!!");
			$.mobile.loading("hide");
			$.mobile.navigate("#product-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Category not found.");
			}
			else {
				alert("Internal Server Error.");
			}
		}
	});
}

//viewing browse category
$(document).on('pagebeforeshow', "#browse_view1", function( event, ui ) {
			view = 2;
			if(currentCategory == "empty"){

			var productList = currentProducts;
			var len = productList.length;
			var list = $("#myBrowseView1");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				list.append("<li><a onclick=viewProduct(" + product.pid + ")>" + 
					"<h2>" + product.pname + " " + product.pbrand +  "</h2>" + 
					"<p>" + product.pmodel + "</p>" +
					"<p><strong> Condition: </strong></p>" + 
					"<p class=\"ui-li-aside\">" + product.pinstant_price + "</p>" +
					"</a></li>");
			}
			list.listview("refresh");	

			}else{
			var categoriesList = currentCategory;
			var len = categoriesList.length;
			var list = $("#myBrowseView1");
			list.empty();
			var category;
			for (var i=0; i < len; ++i){
				category = categoriesList[i];
				list.append("<li><a onclick=Browse("+category.cid+")>" + category.cname + "</a></li>");
			}
			list.listview("refresh");	
		}

});

//viewing browse category
$(document).on('pagebeforeshow', "#browse_view2", function( event, ui ) {
			view = 1;
			if(currentCategory == "empty"){
			var productList = currentProducts;
			var len = productList.length;
			var list = $("#myBrowseView2");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				list.append("<li><a onclick=viewProduct(" + product.pid + ")>" + 
					"<h2>" + product.pname + " " + product.pbrand +  "</h2>" + 
					"<p>" + product.pmodel + "</p>" +
					"<p><strong> Condition: </strong></p>" + 
					"<p class=\"ui-li-aside\">" + product.pinstant_price + "</p>" +
					"</a></li>");
			}
			list.listview("refresh");			
			}else{
			var categoriesList = currentCategory;
			var len = categoriesList.length;
			var list = $("#myBrowseView2");
			list.empty();
			var category;
			for (var i=0; i < len; ++i){
				category = categoriesList[i];
				list.append("<li><a onclick=Browse("+category.cid+")>" + category.cname + "</a></li>");
			}
			list.listview("refresh");	
			}
});




//puts the information of the product in the page
$(document).on('pagebeforeshow', "#product-page", function( event, ui ) {

alert("sjldjsdjhdlfhlsdhf");
alert(selectedProduct.pname);

	$("#pname").val(selectedProduct.pname);
	$("#pinstant_price").val(selectedProduct.pinstant_price);
	$("#pdesc").val(selectedProduct.pdescription);
	$("#pmodel").val(selectedProduct.pmodel);
	$("#pbrand").val(selectedProduct.pbrand);
});



//welcomes the user
$(document).on('pagebeforeshow', "#home_page", function( event, ui ) {
	var list = $("#home");
	list.empty();
	alert(currentSignedIn);
	list.append("<a>Welcome " + currentSignedIn + "!</a>");	
});

////////////////////////////////////////////////////////////////////////////////////////////////
/// Functions Called Directly from Buttons ///////////////////////



function ConverToJSON(formData){
	var result = {};
	$.each(formData, 
		function(i, o){
			result[o.name] = o.value;
	});
	return result;
}


//creates an user
function SaveUser(){

	var temp1 = $("#firstname").val();
	var temp2 = $("#lastname").val();
	var temp3 = $("#email").val();
	var temp4 = $("#mail").val();
	if(temp1 == "" || temp2 == "" || temp3 == "" || temp4 == ""){
		alert("invalid input");	
	}
	else{
	$.mobile.loading("show");
	var form = $("#user-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newUser = ConverToJSON(formData);
	console.log("New Car: " + JSON.stringify(newUser));
	var newUserJSON = JSON.stringify(newUser);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/user1",
		method: 'post',
		data : newUserJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#username_form");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});
}
}

function SaveUserName(){
	$.mobile.loading("show");
	var form = $("#username-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newUser = ConverToJSON(formData);
	console.log("New Car: " + JSON.stringify(newUser));
	var newUserJSON = JSON.stringify(newUser);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/user2",
		method: 'post',
		data : newUserJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#credit_page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});
}

function SaveAccountInfo(){
	$.mobile.loading("show");
	var form = $("#credit-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newUser = ConverToJSON(formData);
	console.log("New Car: " + JSON.stringify(newUser));
	var newUserJSON = JSON.stringify(newUser);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/user3",
		method: 'post',
		data : newUserJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#confirmed_registration");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});
}

//JR 4/10/13
function SaveProduct(){
	$.mobile.loading("show");
	var form = $("#selling-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newProduct = ConverToJSON(formData);
	console.log("New Product: " + JSON.stringify(newProduct));
	var newProductJSON = JSON.stringify(newProduct);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/products",
		method: 'post',
		data : newProductJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#selling_form_message");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});


}

function bid(){
	$.mobile.loading("show");
	var form = $("#bidAmount");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newProduct = ConverToJSON(formData);
	console.log("New Product: " + JSON.stringify(newProduct));
	var newProductJSON = JSON.stringify(newProduct);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/bid",
		method: 'post',
		data : newProductJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert("Bid successful");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});
}


//Deprecated
function authenticate(){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/something",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){

			var userList = data.users;
			var len = userList.length;
			var isValidUser = 0;
			var username = $("#user_name").val();
			var password = $("#password2").val();
			for (var i=0; i < len; ++i){
				if(userList[i].username == username && userList[i].password == password){
				currentUser = userList[i];
				isValidUser = 1;
			}
			}
			if(isValidUser == 1){
			currentSignedIn = username;
			$.mobile.loading("hide");
			$.mobile.navigate("#home_page");
		} else{
			$.mobile.loading("hide");
			alert("not valid username & password combination");
		}
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
			}
			else {
				alert("Internalf Server Error.");
			}
		}
	});
}

function authenticateNew(){
	$.mobile.loading("show");
	var form = $("#userAndPass_form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newProduct = ConverToJSON(formData);
	console.log("New Product: " + JSON.stringify(newProduct));
	var newProductJSON = JSON.stringify(newProduct);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/authenticate",
		method: 'post',
		data : newProductJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			currentSignedIn = data.user.firstName;
			alert(currentSignedIn);
			$.mobile.loading("hide");
			$.mobile.navigate("#home_page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("No match found!!!");
		}
	});


}



function signOut(){
currentSignedIn = "";
view = 1;
$.mobile.navigate("#welcome_page");
}



$(document).on('pagebeforeshow', "#my_profile_editor", function( event, ui ) {
// currentCar has been set at this point
$("#upd-email").val(currentUser.email);
$("#upd-mail").val(currentUser.mail);
$("#upd-password").val(currentUser.password);
$("#upd-accountNumber").val(currentUser.accountNumber);
$("#upd-billingAddress").val(currentUser.billingAddress);
$("#upd-CCinfo").val(currentUser.CCinfo);
});


function GetUser(){
id = currentUser.id;
$.mobile.loading("show");
$.ajax({
url : "http://localhost:3412/ICOM5016Srv/users/" + id,
method: 'get',
contentType: "application/json",
dataType:"json",
success : function(data, textStatus, jqXHR){
currentUser = data.user;
$.mobile.loading("hide");
$.mobile.navigate("#my_profile_editor");
},
error: function(data, textStatus, jqXHR){
console.log("textStatus: " + textStatus);
$.mobile.loading("hide");
if (data.status == 404){
alert("User not found.");
}
else {
alert("Internal Server Error.");
}
}
});
}

function UpdateUser(){ 
$.mobile.loading("show");
var form = $("#user-view-form");
var formData = form.serializeArray();
console.log("form Data: " + formData);
var updUser = ConverToJSON(formData);
updUser.id = currentUser.id;
console.log("Updated User: " + JSON.stringify(updUser));
var updUserJSON = JSON.stringify(updUser);
$.ajax({
url : "http://localhost:3412/ICOM5016Srv/temp/" + updUser.id,
method: 'put',
data : updUserJSON,
contentType: "application/json",
dataType:"json",
success : function(data, textStatus, jqXHR){
currentUser = data.user;
$.mobile.loading("hide");
$.mobile.navigate("#profile_page");
},
error: function(data, textStatus, jqXHR){
console.log("textStatus: " + textStatus);
$.mobile.loading("hide");
if (data.status == 404){
alert("Data could not be updated!");
}
else {
alert("Internal Error.");	
}
}
});
}


function UpdateProduct(){ 
$.mobile.loading("show");
var form = $("#productForm");
var formData = form.serializeArray();
console.log("form Data: " + formData);
var updProduct = ConverToJSON(formData);
updProduct.id = selectedProduct.id;
console.log("Updated Product: " + JSON.stringify(updProduct));

var updProductJSON = JSON.stringify(updProduct);
$.ajax({
url : "http://localhost:3412/ICOM5016Srv/UpdateProduct/" + updProduct.id,
method: 'put',
data : updProductJSON,
contentType: "application/json",
dataType:"json",
success : function(data, textStatus, jqXHR){
CurrentProduct = data.product;
$.mobile.loading("hide");
$.mobile.navigate("#MyZaar");
},
error: function(data, textStatus, jqXHR){
console.log("textStatus: " + textStatus);
$.mobile.loading("hide");
if (data.status == 404){
alert("Data could not be updated!");
}
else {
alert("Internal Error.");	
}
}
});
}

//list de sell items 4/10/13
$(document).on('pagebeforeshow', "#MyZaar", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/Icom5016Srv/sellingproducts",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.products;
			var len = productList.length;
			var list = $("#selling-list");
			list.empty();
			var product;
			alert("corn maze");
			for (var i=0; i < len; ++i){
				product = productList[i];
				list.append("<li><a onclick=viewProduct(" + product.id + ")>" + 
					"<h2>" + product.pName + " " + product.brand +  "</h2>" + "<img src="+product.photo+" />" + 
					"<p>" + product.model + "</p>" +
					"<p><strong> Condition: </strong></p>" + 
					"<p class=\"ui-li-aside\">" + "$" + product.iPrice + " <br>"+ "$" + product.bPrice+ "</p>" +
					"</a></li>");
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});


$(document).on('pagebeforeshow', "#profile_page", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/Icom5016Srv/sellingproducts",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.products;
			var len = productList.length;
			var list = $("#also_selling-list");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				list.append("<li><a onclick=viewProduct(" + product.id + ")>" + 
					"<h2>" + product.pName + " " + product.brand +  "</h2>" + "<img src="+product.photo+" />" + 
					"<p>" + product.model + "</p>" +
					"<p><strong> Condition: </strong></p>" + 
					"<p class=\"ui-li-aside\">" + product.iPrice + " <br>"+ product.bPrice+ "</p>" +
					"</a></li>");
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});


$(document).on('pagebeforeshow', "#bid_history", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/Icom5016Srv/sellingproducts",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.products;
			var len = productList.length;
			var list = $("#history");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				list.append("<li><a onclick=viewProduct(" + product.id + ")>" + 
					"<h2>" + product.pName + " " + product.brand +  "</h2>" + "<img src="+product.photo+" />" + 
					"<p>" + product.model + "</p>" +
					"<p><strong> Condition: </strong></p>" + 
					"<p class=\"ui-li-aside\">" + product.iPrice + " <br>"+ product.bPrice+ "</p>" +
					"</a></li>");
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});


$(document).on('pagebeforeshow', "#checkOut_page", function( event, ui ) {

    var list1 = $("#adress_cart");
    list1.empty();
    list1.append(currentUser.billingAddress);

    var list3 = $("#name_cart");
    list3.empty();
    list3.append(currentUser.firstname + " " + currentUser.lastname);

    var list2 = $("#tbody_cart");
    list2.empty();
    products = shoppingCartIDs;
    for(var i = 0; i < products.length; i++){
    list2.append("<tr>" + 
          "<th>"+ products[i].pName +"</th>" +
          "<td> 1 </td>" +
          "<td>" +products[i].iPrice+"</td>" +
          "<td>"+ products[i].iPrice +"</td>" +
        "</tr>");
    }    

});

$(document).on('pagebeforeshow', "#BIN_invoice", function( event, ui ) {
 
    var list1 = $("#adress_BIN");
    list1.empty();
    list1.append(currentUser.billingAddress);

    var list3 = $("#name_BIN");
    list3.empty();
    list3.append(currentUser.firstname + " " + currentUser.lastname);

    var list2 = $("#tbody_BIN");
    list2.empty();
    list2.append("<tr>" + 
          "<th>"+ selectedProduct.pName +"</th>" +
          "<td> 1 </td>" +
          "<td>" +selectedProduct.iPrice+"</td>" +
          "<td>" +selectedProduct.iPrice+"</td>" +
        "</tr>");    
});

function rateUser(){
alert("Thank you for rating!");
$.mobile.loading("show");
    var form = $("#rate_form");
    var formData = form.serializeArray();
    var newCar = ConverToJSON(formData);
    var newCarJSON = JSON.stringify(newCar);
   
    $.ajax({
        url : "http://localhost:3412/ICOM5016Srv/rating",
        method: 'post',
        data : newCarJSON,
        contentType: "application/json",
        dataType:"json",
        success : function(data, textStatus, jqXHR){
            $.mobile.loading("hide");
        },
        error: function(data, textStatus, jqXHR){
            console.log("textStatus: " + textStatus);
            $.mobile.loading("hide");
            alert("Data could not be added!");
        }
    });

}

//added by Hector
//modified by Ramon

function Search(){

var searchWord = $("#search-basic").val();
alert(searchWord);
$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/search/" + searchWord,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			//alert("success");
			var productList = data.products;
			
			var len = productList.length;
			
			var list = $("#movies-list");
		
			//alert("Movie: " + moviesList[0].movieName);
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				
			list.append("<li><a onclick=viewProduct(" + product.pid + ")>" + 
					"<h2>" + product.pname + " " + product.pbrand +  "</h2>" + 
					"<p>" + product.pmodel + "</p>" +
					"<p><strong> Condition: </strong></p>" + 
					"<p class=\"ui-li-aside\">$" + product.pinstant_price + " <br>"+
					"</a></li>");

			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}

//added by Hector
var currentMovie = {};
//added by Hector
function GetMovie(id){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/movie/" + id,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			currentCar = data.movie;
			$.mobile.loading("hide");
			alert("Going to another Page");
			$.mobile.navigate("#movie-view");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Movie not found.");
			}
			else {
				alter("Internal Server Error.");
			}
		}
	});
}

//Added by Hector
function AddNewCategory(){
	$.mobile.loading("show");
	var form = $("#createCategory_form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newCategory = ConverToJSON(formData);
	console.log("New Category: " + JSON.stringify(newCategory));
	var newCategoryJSON = JSON.stringify(newCategory);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/addCategory",
		method: 'post',
		data : newCategoryJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert("AddNewCategory Success");
			$.mobile.navigate("#adminPage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});
}


//added by Hector
function DeleteCategory(){
$.mobile.loading("show");
	var id = 0;
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/deleteCategory/" + id,
		method: 'delete',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert("Delete Category Success");
			$.mobile.navigate("#adminPage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Category not found.");
			}
			else {
				alter("Internal Server Error.");
			}
		}
	});


}

function ModifyUser(){
$.mobile.loading("show");
	var form = $("#ModifyUser_form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var updUser = ConverToJSON(formData);
	var id = 0;
	console.log("Updated User: " + JSON.stringify(updUser));
	var updUserJSON = JSON.stringify(updUser);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/modifyUser/" + id,
		method: 'put',
		data : updUserJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert("Modify User Success");
			$.mobile.navigate("#adminPage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Data could not be updated!");
			}
			else {
				alert("Internal Error.");		
			}
		}
	});
}

//added by Hector
function GetReport(){
$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/reports",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			alert("Get Report Success");
			$.mobile.navigate("#TotalSales_Report");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}

//added by Hector
$(document).on('pagebeforeshow', "#bids_listPage", function( event, ui ) {

	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/bids",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			
			var bidsList = data.bids;
			
			var len = bidsList.length;
			
			var list = $("#bids-list");
			
			list.empty();
			var bid;
			
			for (var i=0; i < len; ++i){
				bid = bidsList[i];
				list.append("<li><a>" +
					"<h2> Product: " + bid.productName + " ID: " + bid.productID +  "</h2>" +
					"<p><strong> Price: " + bid.bidPrice + "</strong></p>" +
					"<p>" + bid.bidProgress + "</p>" +
					"<p> You are a " + bid.bidType + "</p>" +
					"</a></li>");
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});


function GetBid(id){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/bids/" + id,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			currentBid = data.bid;
			$.mobile.loading("hide");
			//$.mobile.navigate("#");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Bid not found.");
			}
			else {
				alert("Internal Server Error.");
			}
		}
	});
}


function deleteUser(){
	$.mobile.loading("show");
	var id = currentUser.id;
	$.ajax({
		url : "http://localhost:3412/ICOM5016/deleteUser/" + id,
		method: 'delete',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#welcome_page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("User not found.");
			}
			else {
				alter("Internal Server Error.");
			}
		}
	});
}

function watching(){

$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/watching",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			currentProducts = data.product;
			$.mobile.loading("hide");
			$.mobile.navigate("#MyZaar");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Category not found.");
			}
			else {
				alert("Internal Server Error.");
			}
		}
	});


}


function buying(){

$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/buying",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			myBidHistory = data.bids;
			$.mobile.loading("hide");
			$.mobile.navigate("#bid_history");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Category not found.");
			}
			else {
				alert("Internal Server Error.");
			}
		}
	});


}

function selling(){


	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/selling",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			myBidHistory = data.bids;
			$.mobile.loading("hide");
			$.mobile.navigate("#bid_history");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Category not found.");
			}
			else {
				alert("Internal Server Error.");
			}
		}
	});


}
