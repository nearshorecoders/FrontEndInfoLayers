/**@author asr*/

var asignarMesas = (function() {

	var title = document.title;
	var favicon = "";
	var domain = window.location.pathname.replace("index", "");
	
	var currentWall;
	var pathArray = window.location.pathname;
	var stompClient = null;
	var stompClientChat = null;

	var wallType = {};		
	var tableOrders= [];		
	var intCurrenntWall = 1;
	var urlPrefix="/businesstools";
	var canvas = null;
	var chart1 = null;
	var mainDataSet;
	var i = 0;
	var mesaSeleccionadaId='';
	var mesaSeleccionadaIdBD='';
	var nombreClienteMesaSeleccionada='';
	var apellidoClienteMesaSeleccionada='';
	var initProperties = function() {
		events.slowNetworkDetection();	
	}
	
	var catchDom = function() {
		
	};
	
	var suscribeEvents = function() {
		events.cleanMesaFields();
		events.getAllProducts();
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
			cleanMesaFields : function() {

			},
			filterMesas : function() {
				console.log("Filtrar mesas");
			},
			seleccionMesa : function(element) {
				mesaSeleccionadaId=$(element).attr('data-idmesa');
				//tableOrders[mesaId];
				
				mesaSeleccionadaIdBD=$(element).attr('data-idmesa-bdid');
				
				$('#indicadorMesa').text('');
				
				$('#indicadorMesa').text('Mesa #'+mesaSeleccionadaId.replace('mesa',''));
				
	    		if(typeof(tableOrders[mesaSeleccionadaId])==='undefined'){
	    			$('#tableProductsOrder').html('');
	    		}else{
	    			$('#tableProductsOrder').html(tableOrders[mesaSeleccionadaId]);
	    		}
				
				console.log("Mesa seleccionada= "+mesaSeleccionadaId);
				
				$("#modal-producto-busqueda").modal('show');
				
			},
			getAllProducts : function() {
				$.ajax({
				    url: urlPrefix+"/getAllProducts",
				    type: "GET",
				}).done(function( json ) {
					
					console.log(json);
					$("#tableProducts").empty();
 
					var contentRow='';
					for(i=0 ; i < json.listaProductosTodos.length ; i++){
						
						fila=json.listaProductosTodos[i];
						
						defaultImg1='';
						if(fila.imagen1==null || fila.imagen1=="null"){
							defaultImg1='<img class="img-responsive " src="js/theme/dist/img/opt1.jpg" alt="Photo"/>';
						}else{
							defaultImg1='<img class="img-responsive" src="'+fila.imagen1+'" alt="Photo">';
						}
						
						contentRow = contentRow+'<tr id="product'+fila.id+'">'+
									'<td>' + fila.id + '</td>'+
									'<td>' + fila.descripcion + '</td>'+
									'<td>$'+fila.precioVenta+'</td>'+
									'<td>'+defaultImg1+'</td>'+
									'<td><input id="productoQty'+fila.id+'" type="number" value="1" name="qtyAdd" class="form-control pull-right" /></td>'+
									'<td><a id="'+fila.id+'" class="btn btn-block btn-success fa fa-plus-circle" onclick="asignarMesas.events.getAddProductFromRowSelected(this);" type="button"></a></td>'+
									'</tr>';	
					}
					
					$("#tableProducts").append(contentRow);
					
				}).fail(function( xhr, status, errorThrown ) {
					//console.log( "Sorry, there was a problem!" );
				    console.log( "Error: " + errorThrown );
				    console.log( "Status: " + status );
				    //console.dir( xhr );
				}).always(function( xhr, status ) {
				    //console.log( "The request is complete!" );
				});
				
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
			actualizarEstatusMesa:function(){
				noMesa=mesaSeleccionadaId.replace('mesa','');
				idMesa=mesaSeleccionadaIdBD;
				estatusString=events.getSelectedTextFromSelect("selectEstatusMesa");
	    		estatus=1;
				if(estatusString=="Ocupada"){
					estatus=2;
	    		}else if(estatusString=="Por limpiar"){
	    			estatus=3;
	    		}else if(estatusString=="Reservada"){
	    			estatus=4;
	    		}else if(estatusString=="Por cobrar"){
	    			estatus=5;
	    		}
				
				dataToSend={
	    				noMesa:noMesa,
	    				idMesa:idMesa,
	    				estatusMesa:estatus
	    		}
	    		
				$.ajax({
				    url: urlPrefix+"/updateStatusMesa",
				    type: "POST",
				    dataType : "json",
				    data:JSON.stringify(dataToSend),
				    headers: { 
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				    },
				}).done(function( json ) {
					console.log(json);
					$.notify({
			    		title: '<strong>Se cambio el estatus de la mesa a '+estatusString+'</strong>',
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
			getSelectedTextFromSelect:function(elementId){
				var elt = document.getElementById(elementId);

				if (elt.selectedIndex == -1)
				        return null;
				return elt.options[elt.selectedIndex].text;
			},
			getAddProductFromRowSelected : function(element) {				
				//no se puede agregar productos a la mesa si no se ha cambiado el estatus a ocupada.
				
				estatusString=events.getSelectedTextFromSelect("selectEstatusMesa");
				
				if(estatusString=="Ocupada" ){
					
				}else{
					$.notify({
			    		title: '<strong>No se puede agregar un producto si la mesa no se ha marcado como OCUPADA</strong>',
		    			message: ''
			    	},{
			    		type: 'danger',
			    		z_index: 2000,
			    	});
					return;
				}
				
				
				$row=$("#product"+element.id);
				$tds = $row.find("td");             // Finds all children <td> elements
			    idProduct='';
			    descProd='';
			    cantidad=1;
			    subtotal=0; 
			    precioCompra=0.0;
			    
				index=0;
				
				$.each($tds, function() {  
					rowOrdenString='';
				    console.log($(this).text());        // Prints out the text within the <td>
				    switch(index){
				    	case 0:
				    		///id
				    		idProduct=$(this).text();
				    	break;	
				    	case 1:
				    		//desc
				    		descProd=$(this).text();
				    	break;	
				    	case 2:
				    		//precio
				    		precioCompra=parseFloat($(this).text().replace('$',''));
				    	
				    	break;	
				    	case 3:
				    		//foto
				    		
				    	break;
				    	case 4:
				    		//cantidad
				    		cantidad=$('#productoQty'+idProduct).val();
				    	break;
				    	case 5:
				    		//subtotal
				    		subtotal=cantidad*precioCompra;
				    		rowOrdenString='<tr id="productOrderId'+idProduct+'">'
				    						+'<td>'+idProduct+'</td>'
				    						+'<td>'+descProd+'</td>'
				    						+'<td>'+precioCompra+'</td>'
				    						+'<td>'+cantidad+'</td>'
				    						+'<td>'+subtotal+'</td>'
				    						+'<td><a id="'+idProduct+'" class="btn btn-block btn-danger fa fa-minus-circle" onclick="asignarMesas.events.getRemoveProductFromRowSelected(this);" type="button"></a></td>';
				    		
				    		if(cantidad<1){
						    	$.notify({
						    		title: '<strong>No se puede agregar un producto concantidad menor a 1</strong>',
					    			message: ''
						    	},{
						    		type: 'danger',
						    		z_index: 2000,
						    	});
						    	return;
				    		}
				    		
				    		$('#tableProductsOrder').append(rowOrdenString);
				    		$('#productoQty'+idProduct).val('1');
				    		
				    		dataToSend={
				    				consecutivo:idProduct,
				    				noMesa:mesaSeleccionadaId.replace('mesa',''),
				    				cantidad:cantidad,
				    				precio:precioCompra,
				    				subtotal:subtotal,
				    				idMesa:mesaSeleccionadaIdBD,
				    				estatusMesa:2,
				    				descripcion:descProd,
				    				nombreCliente:nombreClienteMesaSeleccionada,
				    				apellidoCliente:apellidoClienteMesaSeleccionada
				    		}
				    		
							$.ajax({
							    url: urlPrefix+"/createProductInOrderByTable",
							    type: "POST",
							    dataType : "json",
							    data:JSON.stringify(dataToSend),
							    headers: { 
							        'Accept': 'application/json',
							        'Content-Type': 'application/json' 
							    },
							}).done(function( json ) {
								console.log(json);
								
							}).fail(function( xhr, status, errorThrown ) {
								//console.log( "Sorry, there was a problem!" );
							    console.log( "Error: " + errorThrown );
							    console.log( "Status: " + status );
							    //console.dir( xhr );
							}).always(function( xhr, status ) {
							    //console.log( "The request is complete!" );
							});
				    		
					    	$.notify({
					    		title: '<strong>Se agrego el producto a la orden correctamente</strong>',
				    			message: ''
					    	},{
					    		type: 'success',
					    		z_index: 2000,
					    	});
				    	break;	
				    }
				    
				    index++;
				});
				
				tableOrders[mesaSeleccionadaId]=$('#tableProductsOrder').html();
			},
			getRemoveProductFromRowSelected : function(element) {
				console.log('Eliminando producto');
				$('#tableProductsToDeleteFromOrder').html('');
				$row=$("#productOrderId"+element.id);
				
				$('#removeToSellButton').attr('data-row-selected','productOrderId'+element.id);
				
				$tds = $row.find("td");             // Finds all children <td> elements
			    idProduct='';
			    descProd='';
			    cantidad=0;
			    subtotal=0; 
			    precioCompra=0.0;
			    
				index=0;
				
				$.each($tds, function() {  
					rowOrdenString='';
				    console.log($(this).text());        // Prints out the text within the <td>
				    switch(index){
				    	case 0:
				    		///id
				    		idProduct=$(this).text();
				    	break;	
				    	case 1:
				    		//desc
				    		descProd=$(this).text();
				    	break;	
				    	case 2:
				    		//precio
				    		precioCompra=parseFloat($(this).text().replace('$',''));
				    	
				    	break;	

				    	case 3:
				    		//cantidad
				    		cantidad=parseInt($(this).text());
				    	break;
				    	case 5:
				    		//subtotal
				    		subtotal=cantidad*precioCompra;
				    		rowOrdenString='<tr id="productOrderDeleteId'+idProduct+'">'
				    						+'<td>'+idProduct+'</td>'
				    						+'<td>'+descProd+'</td>'
				    						+'<td>'+precioCompra+'</td>'
				    						+'<td id="qtyToDeleteHaving">'+cantidad+'</td>'
				    						+'<td>'+subtotal+'</td></tr>';
				    		
				    		$('#tableProductsToDeleteFromOrder').append(rowOrdenString);
				    	break;	
				    }
				    
				    index++;
				});
				
				$('eliminarProductosLabel').text('');
				$('eliminarProductosLabel').text('Eliminar productos de orden Mesa #'+mesaSeleccionadaId.replace('mesa',''));
				$("#modal-producto-eliminar").modal('show');
				
			},
			executeDeleteProduct : function(productElement) {
				qty=parseInt($('#inputQtyToErase').val());
				
				qtyHaving=parseInt($('#qtyToDeleteHaving').text());
				
				if(qty>qtyHaving){
					$.notify({
			    		title: '<strong>No se puede eliminar esa cantidad</strong>',
		    			message: ''
			    	},{
			    		type: 'error',
			    		z_index: 2000,
			    	});
				}else{
					
					qtyHaving=qtyHaving-qty;
					idRow=$('#removeToSellButton').attr('data-row-selected');
					$row=$("#"+idRow);
					if(qtyHaving==0){	
						$row.remove();
					}else if(qtyHaving>0){
						//only update quantity number in productRow
						
						$tds = $row.find("td");             // Finds all children <td> elements
					    
						index=0;
						///actualizar subtotal dependiendo de la cantidad nueva ingresada.
						
						$.each($tds, function() {  
						    switch(index){
						    	case 3:
						    		//cantidad
						    		$(this).text('');
						    		$(this).text(qtyHaving);
						    	break;
						    }
						    
						    index++;
						});
					}
					
					$('#inputQtyToErase').val('0');
					$.notify({
			    		title: '<strong>Se elimino el producto a la orden correctamente</strong>',
		    			message: ''
			    	},{
			    		type: 'success',
			    		z_index: 2000,
			    	});
					$("#modal-producto-eliminar").modal('hide');
					
				}
					
			},
			getAllMesas : function() {
				$.ajax({
				    url: urlPrefix+"/getAllTables",
				    type: "POST",
				}).done(function( json ) {
					console.log(json);
					var contentMesa='';
					contadorColumna=1;
					contadorMesa=1;
					$('#columnaMesas1').empty();
					$('#columnaMesas2').empty();
					$('#columnaMesas3').empty();
					for(i=0 ; i < json.listaMesasTodas.length ; i++){
						
						fila=json.listaMesasTodas[i];
						
						statusMesa='bg-green';
						progressBar='100';
						estatusDescripcion='';
						
						if(fila.status==1){
							statusMesa='bg-green';
							progressBar='100';
							estatusDescripcion='Libre';
						}else if(fila.status==2){
							statusMesa='bg-yellow';
							progressBar='50';
							estatusDescripcion='Ocupado por:';
						}else if(fila.status==3){
							statusMesa='bg-red';
							progressBar='75';
							estatusDescripcion='Por limpiar';
						}else if(fila.status==1){
							statusMesa='bg-aqua';
							progressBar='100';
							estatusDescripcion='Reservado por:';
						}
						
						contentMesa = 
									'<!-- /.info-box -->'
									+'<div class="info-box ' + statusMesa + '" data-idmesa-bdid="'+fila.idMesa+'" data-idmesa="mesa' + fila.numero + '" onclick="asignarMesas.events.seleccionMesa(this);">'
									+'<span class="info-box-icon"><img src="js/theme/dist/img/table.png" width="65px" height="60px"></span>'
									+'<div class="info-box-content">'
									+'  <span class="info-box-number">Mesa ' + fila.numero + ' capacidad: ' + fila.personas + ' personas</span>'
									+'  <span class="info-box-text">' + fila.ubicacion + '</span>'
									+'<div class="progress">'
									+'	<div class="progress-bar" style="width: ' + progressBar + '%"></div>'
									+'  </div>'
									+'  <span class="progress-description" id="estatusTextoMesa' + fila.numero + '">'
									+ estatusDescripcion
									+'	  </span>'
									+'</div>'
									+'<!-- /.info-box-content -->'
									+'</div>';	
						
						if(contadorMesa==5 || contadorMesa==17 || contadorMesa==29 || contadorMesa==41){
							contadorColumna=2;
						}
						if(contadorMesa==9 || contadorMesa==21 || contadorMesa==33 || contadorMesa==45){
							contadorColumna=3;
						}
						if(contadorMesa==13 || contadorMesa==25 || contadorMesa==37 || contadorMesa==49){
							contadorColumna=1;
						}
						contadorMesa=contadorMesa+1;
						$('#columnaMesas'+contadorColumna).append(contentMesa);
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
			createNewMesa : function() {
				
			
			},
		loadMainPage : function() {
			events.changeView("index");
		},
		
		changeView : function (theView) {
			console.log("cambiando vista");
			currentView = theView;
			$("#btContent").load(pathArray +"/" + theView );
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
	asignarMesas.init();
	asignarMesas.events.getAllMesas();
});

function navegacion(element){
	console.log("iniciando asignarMesas-----------------------");
	asignarMesas.events.changeView(element.id);
}
