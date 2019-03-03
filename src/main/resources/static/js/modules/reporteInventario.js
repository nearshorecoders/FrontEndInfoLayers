/**@author asr*/

var reporteInventario = (function() {
	var urlPrefix="/businesstools";
	var title = document.title;
	var favicon = "";
	var domain = window.location.pathname.replace("index", "");
	
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
		$('#tableInventarioProductos').html('');
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
			filterProducts : function() {
				console.log("Filtrar productos");
				  var input, filter, table, tr, td, i, txtValue;
				  input = document.getElementById("searchProduct");
				  filter = input.value.toUpperCase();
				  table = document.getElementById("tableProductsAll");
				  tr = table.getElementsByTagName("tr");

				  for (i = 0; i < tr.length; i++) {
					  
				    tdName=tr[i].getElementsByTagName("td")[1];
				    tdSurNamePat=tr[i].getElementsByTagName("td")[2];
				    tdSurNameMat=tr[i].getElementsByTagName("td")[3];
				    
				    if (tdName || tdSurNamePat || tdSurNameMat) {
				      
				    	txtValueN1 = tdName.textContent || tdName.innerText;
				    	txtValueN2 = tdSurNamePat.textContent || tdSurNamePat.innerText;
				    	txtValueN3 = tdSurNameMat.textContent || tdSurNameMat.innerText;
				    	
				    	fullname=txtValueN1+" "+txtValueN2+" "+txtValueN3;
				    	fullname2=txtValueN1+" "+txtValueN2;
				    	fullname3=txtValueN1+" "+txtValueN3;
				    	fullname4=txtValueN2+" "+txtValueN3;
				    	
				    	 if(fullname.toUpperCase().indexOf(filter) > -1 || fullname2.toUpperCase().indexOf(filter) > -1 || fullname3.toUpperCase().indexOf(filter) > -1 || fullname4.toUpperCase().indexOf(filter) > -1){
					        	tr[i].style.display = "";
					     }else{
					        	tr[i].style.display = "none";
					     }
				    } 
				  }
				
			},
			getProductFromRowSelected : function(element) {
				$row=$("#product"+element.id);
				$tds = $row.find("td");             // Finds all children <td> elements

			    //clean the form
			    $('#inputIdMod').val('');
			    $('#inputCodigoMod').val('');
			    $('#inputDescripcionMod').val('');
			    $('#inputCantidadMod').val('');
			    $('#inputPrecioCompraMod').val('');
			    $('#inputPrecioVentaMod').val('');
			    $('#inputCantidadAceptableMod').val('');
			    $('#inputCantidadMinimaMod').val('');
			    $('#imagenIzquierdaMod').val('');
			    $('#imagenFrontalMod').val('');
			    $('#imagenDerechaMod').val('');
			    
			   ///checar selects
			   //$('#unidadMedidaMod').val('');
			   //$('#presentacionMod').val('');
				index=0;
				$.each($tds, function() {               // Visits every single <td> element
				    console.log($(this).text());        // Prints out the text within the <td>
				    switch(index){
				    	case 0:
				    		$('#inputIdMod').val($(this).text());
				    	break;	
				    	case 1:
				    		$('#inputCodigoMod').val($(this).text());
				    	break;	
				    	case 2:
				    		$('#inputDescripcionMod').val($(this).text());
				    	break;	
				    	case 3:
				    		$('#inputCantidadMod').val($(this).text());
				    	break;	
				    	case 4:
				    		precioCompra=$(this).text().replace('$','');
				    		$('#inputPrecioCompraMod').val(precioCompra);
				    	break;	
				    	case 5:
				    		precioVenta=$(this).text().replace('$','');
				    		$('#inputPrecioVentaMod').val(precioVenta);
				    	break;	
				    	case 6:
				    		$('#inputCantidadAceptableMod').val($(this).text());
				    	break;	
				    	case 7:
				    		$('#inputCantidadMinimaMod').val($(this).text());
				    	break;	
				    }
				    
				    index++;
				});
			},
			getSelectedTextFromSelect:function(elementId){
				var elt = document.getElementById(elementId);

				if (elt.selectedIndex == -1)
				        return null;
				return elt.options[elt.selectedIndex].text;
			},
			createReport : function() {
				console.log("generando reporte de inventario");
					$.ajax({
					    url: urlPrefix+"/getAllProductsExistence",
					    type: "POST",
					}).done(function( json ) {
						console.log("getting report");
						console.log(json);
						
						$('#tableInventarioProductos').html('');
						stringContent='';
						for(i=0;i<json.listaProductosTodos.length;i++){
							currentRow=json.listaProductosTodos[i];
							stringContent=stringContent+'<tr>'
			                  +'<td>'+currentRow.id+'</td>'
							  +'<td>'+currentRow.codigo+'</td>'
							  +'<td>'+currentRow.marca+'</td>'
			                  +'<td>'+currentRow.descripcion+'</td>'
			                  +'<td>'+currentRow.unidadesEnCaja+'</td>'
			                  +'<td>'+currentRow.unidadesVendidas+'</td>'
			                  +'<td><a type="submit" class="btn btn-info pull-right" onclick=";">Registrar inconsistencía</a></td>'
			                  +'</tr>';
						}
						$('#tableInventarioProductos').append(stringContent);
				    	$.notify({
				    		title: '<strong>Se genero el reporte correctamente </strong>',
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
	reporteInventario.init();
});

function navegacion(element){
	console.log("iniciando reporte ventas-----------------------");
	reporteInventario.events.changeView(element.id);
}
