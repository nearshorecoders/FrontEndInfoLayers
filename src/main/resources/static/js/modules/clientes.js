/**@author asr*/

var clientes = (function() {

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
		events.cleanClientFields();
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
			getDetailClient : function(clientIdToSend) {
				$row=$("#table"+element);
				$tds = $row.find("td");             // Finds all children <td> elements
				events.cleanUpdateClientFields();
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
				    		$('#inputNombreMod').val($(this).text());
				    	break;	
				    	case 2:
				    		$('#inputApellidoPMod').val($(this).text());
				    	break;	
				    	case 3:
				    		$('#inputApellidoMMod').val($(this).text());
				    	break;
				    	case 4:
				    		$('#inputEmailMod').val($(this).text());
				    	break;	
				    	case 5:
				    		$('#inputTelefonoMod').val($(this).text());
				    	break;
				    	case 6:
				    		$('#inputTelefono2Mod').val($(this).text());
				    	break;	
				    	case 7:
				    		$('#inputDireccionMod').val($(this).text());
				    	break;	
				    }
				    
				    index++;
				});
				
				
				/*descomentar en caso de implementar facturase historial de compras de cliente
				 * dataToSend={
						clientId:clientIdToSend
				}
				$.ajax({
				    url: urlPrefix+"/getClientDetail",
				    type: "POST",
				    data:dataToSend,
				}).done(function( json ) {
					console.log("Obteniendo detalle cliente");
					console.log(json);
					
					if(json.historialVentas.listaReporteVentas.length==0){
						
					}
					$('#tableClienteVentas').html('');
					
					stringContentVentas='';
					for(i=0;i<json.historialVentas.listaReporteVentas.length;i++){
						currentRow=json.historialVentas.listaReporteVentas[i];
						statusButton='<button type="button" class="btn btn-block btn-success">Entregado '+layout.events.formatMillisOnlyDate(currentRow.fecha)+'</button>';
						buttonFactura='<button type="button" class="btn btn-block btn-primary" onclick="clientes.events.getFacturaFromClient(1);">Factura</button>';
						stringContentVentas=stringContentVentas+'<tr>'
		                  	+'<td>'+layout.events.formatMillisOnlyDate(currentRow.fecha)+'</td>'
						  	+'<td>'+currentRow.descripcion+'</td>'
						  	+'<td>'+currentRow.marca+'</td>'
		                  	+'<td>'+currentRow.cantidadVendida+'</td>'
						  	+'<td>'+currentRow.precioTotal+'</td>'
						  	+'<td>'+statusButton+'</td>'
						  	+'<td>'+buttonFactura+'</td>'
		                	+'</tr>';
					}
					
					$('#tableClienteVentas').append(stringContentVentas);
					
					if(json.estadoDeCuenta.listaEstadoDeCuenta.length==0){
						
					}
					$('#tableEstadoCuenta').html('');
					
					stringContentCuenta='';
					for(i=0;i<json.estadoDeCuenta.listaEstadoDeCuenta.length;i++){
						currentRow=json.estadoDeCuenta.listaEstadoDeCuenta[i];
						statusButton='<button type="button" class="btn btn-block btn-success">Entregado '+layout.events.formatMillisOnlyDate(currentRow.fecha)+'</button>';
						buttonFactura='<button type="button" class="btn btn-block btn-primary" onclick="clientes.events.getFacturaFromClient(1);">Factura</button>';
						stringContentCuenta=stringContentCuenta+'<tr>'
						  +'<td>'+currentRow.consecutivo+'</td>'
		                  +'<td>'+layout.events.formatMillisDate(currentRow.fecha)+'</td>'
						  +'<td>'+currentRow.descripcion+'</td>'
		                  +'<td>'+currentRow.marca+'</td>'
		                  +'<td>'+currentRow.cantidad+'</td>'
		                  +'<td>'+currentRow.cuentaTotal+'</td>'
		                  +'<td>'+currentRow.restante+'</td>'
		                  +'<td>'+currentRow.nuevoRestante+'</td>'
						  +'<td>'+statusButton+'</td>'
						  +'<td>'+buttonFactura+'</td>'
						  +'</tr>';
					}
					
					$('#tableEstadoCuenta').append(stringContentCuenta);
					
				}).fail(function( xhr, status, errorThrown ) {
					//console.log( "Sorry, there was a problem!" );
				    console.log( "Error: " + errorThrown );
				    console.log( "Status: " + status );
				    //console.dir( xhr );
				}).always(function( xhr, status ) {
				    //console.log( "The request is complete!" );
				});*/
				
				$('#modal-cliente-detalle').modal('show');
			},
			getFacturaFromClient : function(clientId) {
				$('#modal-compra-factura').modal('show');
			},
			enviarMailFactura : function(clientId) {

				$.ajax({
					    url: urlPrefix+"/sendInvoice",
					    type: "POST",
					    
				}).done(function( json ) {
				    	$.notify({
				    		title: '<strong>OK!</strong>',
				    		message: 'Se envio la factura.'
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
			cleanClientFields : function() {
				$("#inputNombre").val('');
				$("#inputApellidoP").val('');
				$("#inputApellidoM").val('');
				$("#inputTelefono").val('');
				$("#inputDireccion").val('');
				$("#inputTelefono2").val('');
				$("#inputEmail").val('');
			},
			cleanUpdateClientFields : function() {
				$("#inputIdMod").val('');
				$("#inputNombreMod").val('');
				$("#inputApellidoPMod").val('');
				$("#inputApellidoMMod").val('');
				$("#inputTelefonoMod").val('');
				$("#inputDireccionMod").val('');
				$("#inputTelefono2Mod").val('');
				$("#inputEmailMod").val('');
			},
			filterClients : function() {
				// Declare variables 
				console.log("Filtrar clientes");
				  var input, filter, table, tr, td, i, txtValue;
				  input = document.getElementById("searchClient");
				  filter = input.value.toUpperCase();
				  table = document.getElementById("tableClientsAll");
				  tr = table.getElementsByTagName("tr");

				  // Loop through all table rows, and hide those who don't match the search query
				  for (i = 0; i < tr.length; i++) {
				    //td = tr[i].getElementsByTagName("td")[0];
				    
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
//				      if (txtValueN1.toUpperCase().indexOf(filter) > -1 || txtValueN2.toUpperCase().indexOf(filter) > -1 ||txtValueN3.toUpperCase().indexOf(filter) > -1) {
//				        tr[i].style.display = "";
//				      } else {  
//				        tr[i].style.display = "none";
//				       
//				      }
				      
				    } 
				  }
				
			},
			getAllClients : function() {
				$.ajax({
				    url: urlPrefix+"/getAllClients",
				    type: "GET",
				}).done(function( json ) {
					console.log("Getting all clients");
					console.log(json);
					$("#tableClients").html("");
					
					stringTableClients="";
					for(i=0;i<json.listaClientesTodos.length;i++){
						clienteActual=json.listaClientesTodos[i];
						stringTableClients=stringTableClients++'<tr id="table'+clienteActual.idClienteAModificar+'">'
											+'<td>'+clienteActual.idClienteAModificar+'</td>'
											+'<td>'+clienteActual.varNombre+'</td>'
											+'<td>'+clienteActual.varApellidoP+'</td>'
											+'<td>'+clienteActual.varApellidoM+'</td>'
											+'<td>'+clienteActual.email+'</td>'
											+'<td>'+clienteActual.varTelefono+'</td>'
											+'<td>'+clienteActual.telefono2+'</td>'
											+'<td>'+clienteActual.varDireccion+'</td>'
											+'<td><a type="submit" class="btn btn-info pull-right" onclick="clientes.events.getDetailClient('+clienteActual.idClienteAModificar+');">Detalle</a></td>'
											+'</tr>';
					}
					
					$("#tableClients").html(stringTableClients);
					
				}).fail(function( xhr, status, errorThrown ) {
					//console.log( "Sorry, there was a problem!" );
				    console.log( "Error: " + errorThrown );
				    console.log( "Status: " + status );
				    //console.dir( xhr );
				}).always(function( xhr, status ) {
				    //console.log( "The request is complete!" );
				});
				
			},
			createNewClient : function() {
				dataToSend={
					nombre : $("#inputNombre").val(),
					apellidoP : $("#inputApellidoP").val(),
					apellidoM : $("#inputApellidoM").val(),
					telefono : $("#inputTelefono").val(),
					direccion : $("#inputDireccion").val(),
					email : $("#inputEmail").val(),
					telefono2 : $("#inputTelefono2").val(),
				}
				$.ajax({
					
				    url: urlPrefix+"/createClient",
				    type: "POST",
				    dataType : "json",
				    data:JSON.stringify(dataToSend),
				    headers: { 
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				    },
				    
				}).done(function( json ) {
					console.log("creating client");
					console.log(json);
					events.cleanClientFields();
					events.getAllClients();
			    	$.notify({
			    		title: '<strong>Se creo el cliente correctamente </strong>',
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
			updateClient : function() {
				dataToSend={
					id:	$("#inputIdMod").val(),
					nombre : $("#inputNombreMod").val(),
					apellidoP : $("#inputApellidoPMod").val(),
					apellidoM : $("#inputApellidoMMod").val(),
					telefono : $("#inputTelefonoMod").val(),
					direccion : $("#inputDireccionMod").val(),
					email : $("#inputEmailMod").val(),
					telefono2 : $("#inputTelefono2Mod").val(),
				}
				$.ajax({
					
				    url: urlPrefix+"/updateClient",
				    type: "POST",
				    dataType : "json",
				    data:JSON.stringify(dataToSend),
				    headers: { 
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				    },
				    
				}).done(function( json ) {
					console.log("updating client");
					console.log(json);
					events.cleanUpdateClientFields();
					events.getAllClients();
			    	$.notify({
			    		title: '<strong>Se actualizó el cliente correctamente </strong>',
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
	clientes.init();
	clientes.events.getAllClients();
});

function navegacion(element){
	console.log("iniciando clientes-----------------------");
	clientes.events.changeView(element.id);
}
