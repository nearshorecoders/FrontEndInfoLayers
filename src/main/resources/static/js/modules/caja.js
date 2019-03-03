/**@author asr*/

var caja = (function() {

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
		events.cleanFields();
		events.getAllGastos();
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
			getAllGastos:function(){
				var event = new Date();
				mes=parseInt(event.getMonth())+1
				fechaInicial=event.getFullYear()+'-'+mes+'-'+event.getDate()+' 00:00:00';
				fechaFinal=event.getFullYear()+'-'+mes+'-'+event.getDate()+' 23:59:59' ;
				
				fiToSend=fechaInicial;
				ffToSend=fechaFinal;
				dataToSend={
						fi:fiToSend,
						ff:ffToSend
				}
				$.ajax({
				    url: urlPrefix+"/getGastosByDayAndSucursal",
				    type: "POST",
				    data:dataToSend,
				}).done(function( json ) {
					console.log("Obteniendo gastos del dia");
					console.log(json);
					$('#tableGastosRows').html('');
					stringContent='';
					
					if(json.listadoRetiros.length==0){
						$.notify({
				    		title: '<strong>No se han registrado gastos el día de hoy</strong>',
			    			message: ''
				    	},{
				    		type: 'danger',
				    		z_index: 2000,
				    	});		
					}
					
					for(i=0;i<json.listadoRetiros.length;i++){
						currentRow=json.listadoRetiros[i];
						stringContent=stringContent+'<tr>'
			                  +'<td>'+layout.events.formatMillisDate(currentRow.fecha)+'</td>'
							  +'<td>'+currentRow.consecutivo+'</td>'
			                  +'<td>'+currentRow.cantidad+'</td>'
			                  +'<td>'+currentRow.descripcion+'</td>'
							  +'<td>'+currentRow.nombreDeQuienRetiro+'</td>'
			                  +'<td>'+currentRow.nombreSucursal+'</td>'
			                  +'</tr>';
					}
					
					$('#tableGastosRows').append(stringContent);
					
				}).fail(function( xhr, status, errorThrown ) {
					//console.log( "Sorry, there was a problem!" );
				    console.log( "Error: " + errorThrown );
				    console.log( "Status: " + status );
				    //console.dir( xhr );
				}).always(function( xhr, status ) {
				    //console.log( "The request is complete!" );
				});
			},
			saveGasto : function() {
				descripcionToSend=$("#inputGasto").val();
				cantidadTosent=$("#inputGastoCantidad").val();
				dataToSend={
						descripcion:descripcionToSend,
						cantidad:cantidadTosent
				}
				
				$.ajax({
				    url: urlPrefix+"/registrarGasto",
				    type: "POST",
				    data:dataToSend,
				}).done(function( json ) {
					console.log("Registering gasto");
					console.log(json);
					events.getAllGastos();
					events.cleanFields();
				}).fail(function( xhr, status, errorThrown ) {
					//console.log( "Sorry, there was a problem!" );
				    console.log( "Error: " + errorThrown );
				    console.log( "Status: " + status );
				    //console.dir( xhr );
				}).always(function( xhr, status ) {
				    //console.log( "The request is complete!" );
				});
			},
			realizarCorteCaja : function() {
				var event = new Date();
				mes=parseInt(event.getMonth())+1
				fechaInicial=event.getFullYear()+'-'+mes+'-'+event.getDate()+' 00:00:00';
				fechaFinal=event.getFullYear()+'-'+mes+'-'+event.getDate()+' 23:59:59' ;
				
				fiToSend=fechaInicial;
				ffToSend=fechaFinal;
				dataToSend={
						fi:fiToSend,
						ff:ffToSend
				}
				
				$.ajax({
				    url: urlPrefix+"/getBalanceByDateAndSucursal",
				    type: "POST",
				    data:dataToSend,
				}).done(function( json ) {
					console.log("Gettingbalance by date and sucursal");
					console.log(json);
					balanceToSend=json.totalBalance;
					dataToSend2={
							balance:balanceToSend,
					}
					$.ajax({
					    url: urlPrefix+"/realizarCorteDeCaja",
					    type: "POST",
					    data:dataToSend2,
					}).done(function( jsonR ) {
						console.log("Realizando corte de caja");
						console.log(jsonR);
					}).fail(function( xhr, status, errorThrown ) {
						//console.log( "Sorry, there was a problem!" );
					    console.log( "Error: " + errorThrown );
					    console.log( "Status: " + status );
					    //console.dir( xhr );
					}).always(function( xhr, status ) {
					    //console.log( "The request is complete!" );
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
			cleanFields : function() {
				$("#inputGasto").val('');
				$("#inputGastoCantidad").val('');
			},
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
				
				horaDesdeFormateada=fechaDesde+' '+horaDesde+':'+minutoDesde+':00'
				horaHastaFormateada=fechaHasta+' '+horaHasta+':'+minutoHasta+':00'
				
				dataToSend={
						fechaInicial : horaDesdeFormateada,
						fechaFinal: horaHastaFormateada,
					}
					$.ajax({
					    url: urlPrefix+"/getReporteVentas",
					    type: "POST",
					    data:dataToSend,
					}).done(function( json ) {
						console.log("getting report");
						console.log(json);
						
						totalPeriodo=json.totalPeriodo;
						ivaTotalPeriodo=json.ivaTotalPeriodo;
						$("#totalPeriodoAmount").text('$ '+totalPeriodo);
						$("#totalPeriodoIVAAmount").text('$ '+ivaTotalPeriodo);
						
						ventasArray=json.listaReporteVentas;
						$('#tableVentasRows').html('');
						rowVentasString='';
						
						for(i=0;i<ventasArray.length;i++){
							currentRow=ventasArray[i];
							rowVentasString=rowVentasString
							+'<tr>'
							+'  <td>'+currentRow.consecutivoVenta+'</td>'
							+'  <td>'+currentRow.total+'</td>'
							+'  <td>'+currentRow.fecha+'</td>'
							+'  <td>'+currentRow.descripcion+'</td>'
							+'  <td>'+currentRow.direccion+'</td>'
							+'  <td>'+currentRow.precioTotal+'</td>'
							+'  <td>'+currentRow.cantidadVendida+'</td>'
							+'  <td>'+currentRow.subtotal+'</td>'
							+'  <td>'+currentRow.nombre+' '+currentRow.apellidop+' '+currentRow.apellidom+'</td>'
							+'</tr>';
						}
						
						$('#tableVentasRows').append(rowVentasString);
						
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

			}

			function showPopForOfflineConnection(){

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
	caja.init();
});

function navegacion(element){
	console.log("iniciando caja-----------------------");
	caja.events.changeView(element.id);
}
