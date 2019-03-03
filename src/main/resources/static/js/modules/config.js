/**@author asr*/

var config = (function() {

	var title = document.title;
	var favicon = "";
	var domain = window.location.pathname.replace("index", "");
	var urlPrefix="/businesstools";
	var currentWall;
	var pathArray = window.location.pathname;
	var stompClient = null;
	var stompClientChat = null;

	var wallType = {};		
	var intCurrenntWall = 1;
	
	var canvas = null;
	var chart1 = null;
	var mainDataSet;
	var i = 0;

	var initProperties = function() {
		events.slowNetworkDetection();	
	}
	
	var catchDom = function() {
		
	};
	
	var suscribeEvents = function() {
		
		$(".navbar-brand.pitch-logo").on("click", function(){ 
			events.loadMainPage();
        });
		
		$('.nav-link').on('click', function() {
			$("#navbarNavDropdown .nav-link").removeClass("current");
			$(".navbar-nav li").removeClass("active");
			$(this).parent().addClass('active');
			var navLinkDOM = $(this);
			var wall = navLinkDOM.attr('data-option');
			var wallint = navLinkDOM.attr('data-option-int');

			if(wallint == 0){
				wall = "dashboard";
			}
			
			if (wall != "null"){
				events.changeView(wall);
			}
		});
		
	};
	
	var events = {
			getConfig : function() {
				$.ajax({
				    url: urlPrefix+"/getEmpresa",
				    type: "GET",
				}).done(function( json ) {
					console.log("Getting config ");
					console.log(json);
					
					for(i=0;i<json.result.length;i++){
						currentRow=json.result[i];
					    $("#inputIva").val(currentRow.iva*100);
					    $("#inputDescuento1").val(currentRow.descuento1*100);
					    $("#inputDescuento2").val(currentRow.descuento2*100);
					    $("#inputDescuento3").val(currentRow.descuento3*100);
					    $("#inputDescuento4").val(currentRow.descuento4*100);
					    $("#inputDescuento5").val(currentRow.descuento5*100);
					    $("#inputDireccion").val(currentRow.direccion);
					    $("#inputRFC").val(currentRow.rfc);
					    $("#inputNombre").val(currentRow.sucursal);
					    $("#inputSlogan").val(currentRow.slogan);
					    $("#inputPromocional").val(currentRow.textoPromocional);
					    $("#inputTelefono1").val(currentRow.telefono1);
					    $("#inputTelefono2").val(currentRow.telefono2);
					}
					
				}).fail(function( xhr, status, errorThrown ) {
					//console.log( "Sorry, there was a problem!" );
				    console.log( "Error: " + errorThrown );
				    console.log( "Status: " + status );
				    //console.dir( xhr );
				}).always(function( xhr, status ) {
				    //console.log( "The request is complete!" );
				});
				
			},
			updateConfig : function() {
				dataToSend={
				    iva:$("#inputIva").val(),
				    descuento1:$("#inputDescuento1").val(),
				    descuento2:$("#inputDescuento2").val(),
				    descuento3:$("#inputDescuento3").val(),
				    descuento4:$("#inputDescuento4").val(),
				    descuento5:$("#inputDescuento5").val(),
				    direccion:$("#inputDireccion").val(),
				    nombreSucursal:'',
				    rfc:$("#inputRFC").val(),
				    nombreNegocio:$("#inputNombre").val(),
				    slogan:$("#inputSlogan").val(),
				    textoPromocional:$("#inputPromocional").val(),
				    telefono1:$("#inputTelefono1").val(),
				    telefono2:$("#inputTelefono2").val(),
				}
				$.ajax({
				    url: urlPrefix+"/updateEmpresa",
				    type: "PUT",
				    dataType : "json",
				    data:JSON.stringify(dataToSend),
				    headers: { 
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				    },
				    
				}).done(function( json ) {
					console.log("updating config");
					console.log(json);
					events.getConfig();
			    	$.notify({
			    		title: '<strong>Se actualizó la Configuración correctamente </strong>',
		    			message: ''
			    	},{
			    		type: 'success',
			    		z_index: 2000,
			    	});
			    	
				}).fail(function( xhr, status, errorThrown ) {
					//console.log( "Sorry, there was a problem!" );
				    console.log( "Error: " + errorThrown );
				    console.log( "Status: " + status );
				    
				    //console.dir( xhr );
				}).always(function( xhr, status ) {
				    //console.log( "The request is complete!" );
				});
				
			},
		loadMainPage : function() {
			events.changeView("index");
		},
		
		changeView : function (theView) {
			console.log("cambiando vista");
			currentView = theView;
			$("#btContent").load(pathArray +"/"+urlPrefix+  "/" + theView );
		},
		
		slowNetworkDetection : function() {
			// Add event listener offline to detect network loss.
			window.addEventListener("offline", function(e) {
			    showPopForOfflineConnection();
			});

			// Add event listener online to detect network recovery.
			window.addEventListener("online", function(e) {
			    hidePopAfterOnlineInternetConnection();
			});

			function hidePopAfterOnlineInternetConnection(){
				/*			
			    // Enable to text field input
			    $("#input-movie-name").prop('disabled', false);
			    // Enable the search button responsible for triggering the search activity
			    $("#search-button").prop('disabled', false);
			    // Hide the internet connection status pop up. This is shown only when connection if offline and hides itself after recovery.
			    $('#internet-connection-status-dialogue').trigger('close');*/
			}

			function showPopForOfflineConnection(){
				/*
			    // Disable the text field input
			    $("#input-movie-name").prop('disabled', true);
			    // Disable the search button responsible for triggering search activity.
			    $("#search-button").prop('disabled', true);
			    // Show the error with appropriate message title and description.
			    $(".main-error-message").html("Connection Error");
			    $(".main-error-resolution").html(" It seems that your Internet Connection if offline.Please verify and try again later.");
			    $(".extra-error-message").html("(This popup will automatically disappear once connection comes back to life)");
			    // Addition of extra design to improve user experience when connection goes off.
			    $('#internet-connection-status-dialogue').lightbox_me({
			        centered: true,
			        overlaySpeed:"slow",
			        closeClick:false,
			        onLoad: function() {
			        }
			    });*/
			}
		},
	
	}
	
	var initialize = function() {
		initProperties();
		suscribeEvents();
	};


	return {
		init : initialize,
		events: events
	}
	
})();

$(document).ready(function () {
	config.init();
	config.events.getConfig();
});

function navegacion(element){
	console.log("iniciando configuración-----------------------");
	config.events.changeView(element.id);
}
