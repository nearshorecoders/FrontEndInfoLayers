/**@author asr*/

var layout = (function() {

	var title = document.title;
	var favicon = "";
	var domain = window.location.pathname.replace("home", "");
	
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

	var urlPrefix="/infolayers";
	
	var allLayersStates = null;
	
	var initProperties = function() {
		events.slowNetworkDetection();
		events.getMainMenu();
	}
	
	var catchDom = function() {
		
	};
	
	//var pg = {
	//		mapa : null,
	//		globalGeoJson : null,
	//		requestGetAllStates : null,
	//		responseGetAllStates : null,
	//		allLayersStates : [],
	//		statesShowed : [],
	//		globalGeoJson : []
	//	}
	
	var suscribeEvents = function() {
		//all jquery events initialization here
		$(".navbar-brand.pitch-logo").on("click", function(){ 
			
        });
		
		$('.nav-link').on('click', function() {

		});
		
	};
	
	var events = {
		formatMillisDate:function(time){
			 var date = new Date(time);
			 mes=parseInt(date.getMonth())+1
			 dia=date.getDay();
			 if(dia<10){
				 dia='0'+dia;
			 }
			 anio=date.getFullYear();
			 hora=date.getHours();
			 minuto=date.getMinutes();
			 segundo=date.getSeconds();
			 
			 fechaFormated=dia+'/'+mes+'/'+anio+' '+hora+':'+minuto+':'+segundo;
			 
			 return fechaFormated; 
		},
		formatMillisOnlyDate:function(time){
			 var date = new Date(time);
			 mes=parseInt(date.getMonth())+1
			 dia=date.getDay();
			 if(dia<10){
				 dia='0'+dia;
			 }
			 anio=date.getFullYear();
			 hora=date.getHours();
			 minuto=date.getMinutes();
			 segundo=date.getSeconds();
			 
			 fechaFormated=dia+'/'+mes+'/'+anio;
			 
			 return fechaFormated; 
		},	
		loadMainPage : function() {
			events.changeView("index");
			
		},
		
		changeView : function (theView) {
			currentView = theView;
			var url = window.location.href;
			var arr = url.split("/");
			var result = arr[0] + "//" + arr[2]
			$("#btContent").load(result + urlPrefix+ "/" + theView );
		},
		changeLayer : function (edoId,layerName) {
			circumscription.events.loadLayer(edoId,layerName);
		},
		getMainMenu : function() {
			$.ajax({
			    url: urlPrefix+"/getMainMenu",
			    type: "GET",
			    dataType : "json",
			}).done(function( json ) {
				console.log("Getting main menu");
				console.log(json);
				arregloMenu=json.menuContent;
				
				$("#mainMenu").html('');
				
				var stringMenu='<li class="header">MENU PRINCIPAL</li>';
				var stringMenuDinamico='';
				var mainListContainerStart='<li class="treeview">';
				var mainListContainerEnd='</li>';
				currentParentMenu='';
				currentParentMenuName='';
				console.log('Creating menu');
				for(i=0;i<arregloMenu.length;i++){
					
					levels=arregloMenu[i].numberIndex.toString();
					
					arreglolevels=levels.split(".");
					
					numeroNiveles=arreglolevels.length;
					
					var levelFather="";
					
					if(numeroNiveles==2){
						//levelFather=levels[0];
						levelFather=arreglolevels[0];
					}else if(numeroNiveles==3){
						levelFather=levels[0]+"."+levels[1];
					}else if(numeroNiveles==4){
						levelFather=levels[0]+"."+levels[1]+"."+levels[2];
					}else if(numeroNiveles==5){
						levelFather=levels[0]+"."+levels[1]+"."+levels[2]+"."+levels[4];
					}
					
					currentParentMenu=levelFather;
					
					if(arregloMenu[i].moduloPadre==0){
						//currentParentMenu=arregloMenu[i].idpermisos;
						currentParentMenuName=arregloMenu[i].nombreModulo; 
						currentParentMenuName=currentParentMenuName.replace(/ /g,"");
						
						stringMenuDinamico=mainListContainerStart+
											'<li class="treeview" id="menuParent'+arregloMenu[i].numberIndex + '" data-cveedo="'+arregloMenu[i].edoIdentifierMongo + '" >'+
									          '<a href="'+arregloMenu[i].urlAction+'">'+
									           '<i class="fa fa-share"></i> <span>'+ arregloMenu[i].nombreModulo +'</span>'+
									            '<span class="pull-right-container">'+
									              '<i class="fa fa-angle-left pull-right"></i>'+
									            '</span>'+
									          '</a>'+
									          '<ul class="treeview-menu" id="menuChildrenContainer' +currentParentMenu +'">'+
									          '</ul>'+
									         '</li>';
						
						$("#mainMenu").append(stringMenuDinamico);
						
					}else if(arregloMenu[i].moduloPadre==currentParentMenu){
						
						//stringMenuDinamico=  '<li id=menuChildren"'+arregloMenu[i].numberIndex+'" data-fatherLevel="'+levelFather+'"><a href="'+arregloMenu[i].urlAction+'" onclick="layout.events.changeview(\''+arregloMenu[i].urlAction+'\');"><i class="fa fa-circle-o"></i> '+ arregloMenu[i].nombreModulo +'</a></li>';
						if(arregloMenu[i].nombreCapaFront===null){
							///geoJson load
							//stringMenuDinamico=  '<li id=menuChildren"'+arregloMenu[i].numberIndex+'" data-fatherLevel="'+levelFather+'"><a onclick="layout.events.changeLayer(\''+arregloMenu[i].edoIdentifierMongo+'\',\''+arregloMenu[i].nombreCapaMongo+'\');"><i class="fa fa-circle-o"></i> <input id="'+arregloMenu[i].edoIdentifierMongo+''+arregloMenu[i].nombreCapaMongo+'" type="checkbox">'+ arregloMenu[i].nombreModulo +'</a></li>';	
							stringMenuDinamico=  '<li id=menuChildren"'+arregloMenu[i].numberIndex+'" data-fatherLevel="'+levelFather+'"><a onclick="layout.events.changeLayer(\''+arregloMenu[i].edoIdentifierMongo+'\',\''+arregloMenu[i].nombreCapaMongo+'\');"><input id="'+arregloMenu[i].edoIdentifierMongo+''+arregloMenu[i].nombreCapaMongo+'" type="checkbox" onclick="layout.events.changeLayer(\''+arregloMenu[i].edoIdentifierMongo+'\',\''+arregloMenu[i].nombreCapaMongo+'\');">'+ arregloMenu[i].nombreModulo +'</a></li>';	
							
						}else{
							//kmlLoad
							//stringMenuDinamico=  '<li id=menuChildren"'+arregloMenu[i].numberIndex+'" data-fatherLevel="'+levelFather+'"><a onclick="layout.events.changeLayer(\''+arregloMenu[i].edoIdentifierMongo+'\',\''+arregloMenu[i].nombreCapaFront+'\');"><i class="fa fa-circle-o"></i> <input id="'+arregloMenu[i].edoIdentifierMongo+''+arregloMenu[i].nombreCapaFront+'" type="checkbox">'+ arregloMenu[i].nombreModulo +'</a></li>';
							stringMenuDinamico=  '<li id=menuChildren"'+arregloMenu[i].numberIndex+'" data-fatherLevel="'+levelFather+'"><a onclick="layout.events.changeLayer(\''+arregloMenu[i].edoIdentifierMongo+'\',\''+arregloMenu[i].nombreCapaFront+'\');"><input id="'+arregloMenu[i].edoIdentifierMongo+''+arregloMenu[i].nombreCapaFront+'" type="checkbox" onclick="layout.events.changeLayer(\''+arregloMenu[i].edoIdentifierMongo+'\',\''+arregloMenu[i].nombreCapaMongo+'\');">'+ arregloMenu[i].nombreModulo +'</a></li>';
							
						}
						
						$("#menuChildrenContainer"+currentParentMenu).append(stringMenuDinamico);
					
					}			          
					
				}
				
				var menuFooter= '<li class="header">AVISOS</li>'+
			        			'<li><a href="#"><i class="fa fa-circle-o text-red"></i> <span>Sin stock</span></a></li>'+
			        			'<li><a href="#"><i class="fa fa-circle-o text-yellow"></i> <span>Stock minimo</span></a></li>'+
			        			'<li><a href="#"><i class="fa fa-circle-o text-aqua"></i> <span>7-sept-2018</span></a></li>';
				
				$("#mainMenu").append(menuFooter);
				
			}).fail(function( xhr, status, errorThrown ) {
				//console.log( "Sorry, there was a problem!" );
			    console.log( "Error: " + errorThrown );
			    console.log( "Status: " + status );
			    //console.dir( xhr );
			}).always(function( xhr, status ) {
			    //console.log( "The request is complete!" );
			});
			
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
	layout.init();
});

var layoutUtils = {
		intervalB : false,
		refreshTable : function(idTable) {

			try {
				$(idTable).DataTable({
					"language" : {
						"lengthMenu" : "Mostrar _MENU_ registros por pag.",
						"zeroRecords" : "No hay datos para mostrar",
						"info" : "Mostrando _PAGE_ de _PAGES_ páginas",
						"infoEmpty" : "No hay datos para mostrar",
						"infoFiltered" : "(Filtrado de  _MAX_ registros)",
						"sSearch" : "Buscar",
						"oPaginate" : {
							"sFirst" : "Primero",
							"sPrevious" : "Anterior",
							"sNext" : "Siguiente",
							"sLast" : "Último"
						}
					}
				});
			}
			catch(err) {
				console.log(err);
			}
		},
		limpiaTabla : function(idTabla) {
			if ($.fn.dataTable.isDataTable(idTabla)) {
				$(idTabla).DataTable().destroy();
			}
			$(idTabla + " tbody").html("");
		},
		progressDownload: function( id , name, url, callback, modal) {
			var progress = '<div class="progress" id="pgbCapa'+id+'">'+
			  '<div class="progress-bar progress-bar-striped active" role="progressbar"'+
				  'style="width:15%">Iniciando...'+
				  '</div>'+
				'</div>';
			if (modal){
				$("#progressContainerM").append(progress);			
			}else{
				$("#progressContainer").append(progress);
			}
			$.ajax({
			    xhr: function() {
			        var xhr = new window.XMLHttpRequest();
			       xhr.addEventListener("progress", function(evt) {
			           if (evt.lengthComputable) {
			               var percentComplete = evt.loaded / evt.total;
			               var percent = percentComplete *100;
			               if(percent > 5){
			            	   $("#pgbCapa"+id+ " .progress-bar").html(name+" "+(percent).toFixed(2)+ "%");
			            	   $("#pgbCapa"+id+ " .progress-bar").css("width", (percent).toFixed(2)+ "%");
			               }
						   if(percentComplete == 1){
							   $("#pgbCapa"+id).remove();
						   }
			           }
			       }, true);

			       return xhr;
			    },
			    type: 'GET',
			    url: url,
			    dataType: "json",
			    success: callback
			});
		},
		progressDownloadPost: function( id , name, url, callback, modal, dataSend) {
			var progress = '<div class="progress" id="pgbCapa'+id+'">'+
			  '<div class="progress-bar progress-bar-striped active" role="progressbar"'+
				  'style="width:15%">Iniciando...'+
				  '</div>'+
				'</div>';
			if (modal){
				$("#progressContainerM").append(progress);			
			}else{
				$("#progressContainer").append(progress);
			}
			$.ajax({
			    xhr: function() {
			        var xhr = new window.XMLHttpRequest();
			       xhr.addEventListener("progress", function(evt) {
			           if (evt.lengthComputable) {
			               var percentComplete = evt.loaded / evt.total;
			               var percent = percentComplete *100;
			               if(percent > 5){
			            	   $("#pgbCapa"+id+ " .progress-bar").html(name+" "+(percent).toFixed(2)+ "%");
			            	   $("#pgbCapa"+id+ " .progress-bar").css("width", (percent).toFixed(2)+ "%");
			               }
						   if(percentComplete == 1){
							   $("#pgbCapa"+id).remove();
						   }
			           }
			       }, true);

			       return xhr;
			    },
			    type: 'POST',
			    url: url,
			    data: dataSend,
			    dataType: "json",
			    success: callback
			});
		},
		blockDiv: function(div) {
			$(div).block({ 
	            message: $("<img/>").attr("src","img/load.gif").css("width","50%"), 
	            css: { 
	                width: '100%',
	                backgroundColor: "transparent"
	            },
				overlayCSS: { backgroundColor: '#008cc9' } 
	        });
		},
		unBlockDiv: function(div) {
			$(div).unblock();
		},
	}

function navegacion(element){
	console.log("-----------------------");
	layout.events.changeView(element.id);
}

