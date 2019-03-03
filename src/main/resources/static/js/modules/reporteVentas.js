/**@author asr*/

var reporteVentas = (function() {
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
		events.cleanReportFields();
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
			cleanReportFields : function() {
				$("#totalPeriodoAmount").text('$ 0.0');
				$("#totalPeriodoIVAAmount").text('$ 0.0');
				
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
				
				console.log("generando reporte de ventas");
				
				horaDesde=$('#timepickerDesde').data('timepicker').hour;
				minutoDesde=$('#timepickerDesde').data('timepicker').minute;
				//meridianDesde=$('#timepickerDesde').data('timepicker').meridian;
				
				horaHasta=$('#timepickerHasta').data('timepicker').hour;
				minutoHasta=$('#timepickerHasta').data('timepicker').minute;
				//meridianHasta=$('#timepickerHasta').data('timepicker').meridian;
				
				//fechaDesde=$('#datepickerDesde').data('date');
				fechaDesde=$("#datepickerDesde").data('datepicker').getFormattedDate('yyyy-mm-dd');
				//fechaDesde=$('#datepickerHasta').data('date');
				fechaHasta=$("#datepickerHasta").data('datepicker').getFormattedDate('yyyy-mm-dd');
				horaDesdeFormateada='';
				horaHastaFormateada='';
				
				if(minutoDesde=="1"){
					minutoDesde="01";
				}else if(minutoDesde=="2"){
					minutoDesde="02";
				}else if(minutoDesde=="3"){
					minutoDesde="03";
				}else if(minutoDesde=="4"){
					minutoDesde="04";
				}else if(minutoDesde=="5"){
					minutoDesde="05";
				}else if(minutoDesde=="6"){
					minutoDesde="06";
				}else if(minutoDesde=="7"){
					minutoDesde="07";
				}else if(minutoDesde=="8"){
					minutoDesde="08";
				}else if(minutoDesde=="9"){
					minutoDesde="09";
				}else if(minutoDesde=="0"){
					minutoDesde="00";
				}
				
				if(minutoHasta=="1"){
					minutoHasta="01";
				}else if(minutoHasta=="2"){
					minutoHasta="02";
				}else if(minutoHasta=="3"){
					minutoHasta="03";
				}else if(minutoHasta=="4"){
					minutoHasta="04";
				}else if(minutoHasta=="5"){
					minutoHasta="05";
				}else if(minutoHasta=="6"){
					minutoHasta="06";
				}else if(minutoHasta=="7"){
					minutoHasta="07";
				}else if(minutoHasta=="8"){
					minutoHasta="08";
				}else if(minutoHasta=="9"){
					minutoHasta="09";
				}else if(minutoHasta=="0"){
					minutoHasta="00";
				}
				
				
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
							+'  <td>'+layout.events.formatMillisDate(currentRow.fecha)+'</td>'
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
	reporteVentas.init();
});

function navegacion(element){
	console.log("iniciando reporte ventas-----------------------");
	reporteVentas.events.changeView(element.id);
}
