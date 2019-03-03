/**@author asr*/

var ventas = (function() {

	var title = document.title;
	var favicon = "";
	var domain = window.location.pathname.replace("index", "");
	var urlPrefix="/businesstools";
	var currentWall;
	var pathArray = window.location.pathname;
	var stompClient = null;
	var stompClientChat = null;
	var originalTable='';
	var wallType = {};		
	var intCurrenntWall = 1;
	var inputCantidad=0.0;
	var canvas = null;
	var chart1 = null;
	var mainDataSet;
	var i = 0;
	var currentProductFromSearch;
	var lastIdItemAdded=0;
	var productsStringSell='';
	var lastProductRemoved='';
	var lastProductRecovered=0;
	var tableSell=0;
	var tableSelected=0;
	var listaProductosAgregadosAVenta=[];
	var productoAAgregarOriginal={};
	var lastB=0.0;
	var lastI=0.0;
	var lastC=0.0;
	var arrP=[];
	var listaClientesBusqueda=[];
	var clienteSeleccionado=null;
	var initProperties = function() {
		events.slowNetworkDetection();	
	}
	
	var catchDom = function() {
		
	};
	
	var suscribeEvents = function() {
		
		var timer = null;
		$('#inputCodigo').keydown(function(){
		       clearTimeout(timer); 
		       timer = setTimeout(doCallToGetProductByCode, 1000)
		});

		function doCallToGetProductByCode() {
		    console.log('get product by code executing');
		    events.getProductByCode();
		}
		
		var timer2 = null;
		$('#inputCantidadEfectivo').keydown(function(){
		       clearTimeout(timer2); 
		       timer2 = setTimeout(doCallToUpdateChange, 1000)
		});

		function doCallToUpdateChange() {
			amountEntered=parseFloat($('#inputCantidadEfectivo').val());
			lastI=amountEntered;
			changeAmount=amountEntered-lastB;
			lastC=changeAmount;
			$("#changeAmount").text(changeAmount);
		}
		
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
			limpiarBusquedaCliente:function(){
				$('#inputNombreB').val('');
				$('#inputApellidoPB').val('');
				$('#inputApellidoMB').val('');
			},
			selectClient : function(element){
				identificador=$(element).attr('id');
				identificador=parseInt(identificador.replace('clienteSelected',''));
				clienteSeleccionado=listaClientesBusqueda[identificador];
				$("#tableClientesVenta").html('');
				stringContenidoClientes='<tr>'
                +'<td id="selectedClientId">'+clienteSeleccionado.idClienteAModificar+'</td>'
                +'<td>'+clienteSeleccionado.varNombre+'</td>'
                +'<td>'+clienteSeleccionado.varApellidoP+'</td>'
                +'<td>'+clienteSeleccionado.varApellidoM+'</td>'
                +'<td>'+clienteSeleccionado.varTelefono+'</td>'
                +'<td>'+clienteSeleccionado.varDireccion+'</td>'
                +'</tr>';
				$("#modal-busqueda-clientes").modal('hide');
				$("#tableClientesVenta").append(stringContenidoClientes);
				
			},
			buscarCliente: function(){
				nombreToSend=$('#inputNombreB').val();
				nombreToSendMesa=$('#inputNombreB').val();
				apellidoPToSend=$('#inputApellidoPB').val();
				apellidoMToSend=$('#inputApellidoMB').val();				
				//buscamos la palabra mesa en el nombre del cliente 	
				
				nombreToSendMesa=nombreToSendMesa.toLowerCase();
				if(nombreToSendMesa.includes("mesa")){
					nombreToSendMesa=nombreToSendMesa.replace("mesa","");
					nombreToSendMesa=nombreToSendMesa.trim();
					dataToSend={
							idMesa:nombreToSendMesa
						}
					tableSelected=nombreToSendMesa;
					$.ajax({
					    url: urlPrefix+"/getAllOrderByTable",
					    type: "POST",
					    dataType : "json",
					    data:JSON.stringify(dataToSend),
					    headers: { 
					        'Accept': 'application/json',
					        'Content-Type': 'application/json' 
					    },
					}).done(function( json ) {
						console.log("getting table order");
						console.log(json);
						newRowProduct="";
						for(i=0; i<json.ordenPorMesa.length; i++){
							lastIdItemAdded=lastIdItemAdded+1;
							fila=json.ordenPorMesa[i];
							newRowProduct=newRowProduct+'<tr id="sellRow'+lastIdItemAdded+'"><td id="sellRowNumber'+lastIdItemAdded+'">'+lastIdItemAdded+'</td>'
							+'<td>'+fila.descripcion+'</td><td id="addedQty'+i+'">'+fila.cantidad+'</td><td id="price'+i+'">$'+fila.precio+'</td><td id="stPrice'+i+'">$'+fila.subtotal+'</td><td><div class="btn-group"><div class="btn-group">	<button type="button" class="btn btn-default" disabled>Modificar cantidad</button>	<button type="button" class="btn btn-default" disabled>|</button>	<button type="button" class="btn btn-danger" onclick="ventas.events.removeRow(1)" disabled>Eliminar producto</button></div> </div></td></tr>';
						}
				    	$("#tableSell").append(newRowProduct);
				    	$("#modal-busqueda-clientes").modal('hide');
				    	nombreToSend=$('#inputNombreB').val('');
				    	events.calcSellAmount();
						$.notify({
				    		title: '<strong>Orden de la mesa agregada a la venta</strong>',
			    			message: ''
				    	},{
				    		type: 'success',
				    		z_index: 2000,
				    	});
				    	
						tableSell=1;
						
					}).fail(function( xhr, status, errorThrown ) {
						//console.log( "Sorry, there was a problem!" );
					    console.log( "Error: " + errorThrown );
					    console.log( "Status: " + status );
					    //console.dir( xhr );
					}).always(function( xhr, status ) {
					    //console.log( "The request is complete!" );
					});	
				}else{
					dataToSend={
							nombre:nombreToSend,
							apellidop:apellidoPToSend,
							apellidom:apellidoMToSend,
						}
						$("#tableBusquedaCliente").html('');
						$.ajax({
						    url: urlPrefix+"/getClientByName",
						    type: "POST",
						    data:dataToSend,
						}).done(function( json ) {
							console.log("getting clients");
							console.log(json);
							events.limpiarBusquedaCliente();
							stringContenidoClientes='';
							for(i=0;i<json.listadoClientesEncontrados.length;i++){
								currentRow=json.listadoClientesEncontrados[i];
								listaClientesBusqueda[currentRow.idClienteAModificar]=currentRow;
								stringContenidoClientes=stringContenidoClientes+'<tr>'
				                  +'<td>'+currentRow.idClienteAModificar+'</td>'
				                  +'<td>'+currentRow.varNombre+'</td>'
				                  +'<td>'+currentRow.varApellidoP+'</td>'
				                  +'<td>'+currentRow.varApellidoM+'</td>'
				                  +'<td><a id="clienteSelected'+currentRow.idClienteAModificar+'" type="submit" class="btn btn-info pull-right" onclick="ventas.events.selectClient(this);">Seleccionar</a></td>'
				                  +'</tr>';
							}
							$("#tableBusquedaCliente").append(stringContenidoClientes);
							if(json.listadoClientesEncontrados.length>0){
						    	$.notify({
						    		title: '<strong>Se encontrarón clientes </strong>',
					    			message: ''
						    	},{
						    		type: 'success',
						    		z_index: 2000,
						    	});
							}else{
						    	$.notify({
						    		title: '<strong>No se encontraron resultados</strong>',
					    			message: ''
						    	},{
						    		type: 'danger',
						    		z_index: 2000,
						    	});						
							}
							

						}).fail(function( xhr, status, errorThrown ) {
							//console.log( "Sorry, there was a problem!" );
						    console.log( "Error: " + errorThrown );
						    console.log( "Status: " + status );
						    //console.dir( xhr );
						}).always(function( xhr, status ) {
						    //console.log( "The request is complete!" );
						});	
					
				}
				
			},
			vender : function() {
				if(lastB==0.0){
			    	$.notify({
			    		title: '<strong>Error!</strong>',
			    		message: 'No se han agregado productos'
			    	},{
			    		type: 'danger',
			    		z_index: 2000,
			    	});
			    	return;
				}
				
				var amountReceived = $("#inputCantidadEfectivo").val();
				if(amountReceived==""){
			    	$.notify({
			    		title: '<strong>Error!</strong>',
			    		message: 'No se ha ingresado pago'
			    	},{
			    		type: 'danger',
			    		z_index: 2000,
			    	});
			    	return;
				}else{
					amountReceived=parseFloat(amountReceived);
				}

				if(amountReceived < 0.00){
			    	$.notify({
			    		title: '<strong>Error!</strong>',
			    		message: 'El pago no puede ser menor a cero'
			    	},{
			    		type: 'danger',
			    		z_index: 2000,
			    	});
			    	return;
				}else if(amountReceived < lastB){
			    	$.notify({
			    		title: '<strong>Error!</strong>',
			    		message: 'El pago no puede ser menor al total'
			    	},{
			    		type: 'danger',
			    		z_index: 2000,
			    	});
			    	return;
				}
				
				var filtered = listaProductosAgregadosAVenta.filter(function (el) {
					  return el != null;
					});
				clienteSeleccionadoToSend=1;
				if(clienteSeleccionado!=null){
					clienteSeleccionadoToSend=clienteSeleccionado.idClienteAModificar;
				}
				//usuario:1, no importa por que en el back se va por el usuario logueado y se sobreescribe la variable
				dataToSend={
						cambio : lastC,
						cliente : clienteSeleccionadoToSend,
						consecutivoVenta : 0,
						total : lastB,
						efectivo :lastI,
						usuario:1,
						listaDetalle:filtered,
				};
				$.ajax({
						
					    url: urlPrefix+"/createVenta",
					    type: "POST",
					    dataType : "json",
					    data:JSON.stringify(dataToSend),
					    headers: { 
					        'Accept': 'application/json',
					        'Content-Type': 'application/json' 
					    },
					    
				}).done(function( json ) {
						listaClientesBusqueda=[];
						clienteSeleccionado=null;
						console.log("Executing sell");
						console.log(json);
						console.log(json.insertedVenta);
						console.log(json.insertedVenta.consecutivoVenta);
						
						$("#tableClientesVenta").html('');
						stringContenidoClientes='<tr>'
			                  +'<td>1</td>'
			                  +'<td>Cliente</td>'
			                  +'<td>Sin Registro</td>'
			                  +'<td>---</td>'
			                  +'<td>---</td>'
			                  +'<td>---</td>'
			                  +'</tr> ';
						$("#tableClientesVenta").append(stringContenidoClientes);
						
						
				    	$.notify({
				    		title: '<strong>OK!</strong>',
				    		message: 'Se ha realizado correctamente la venta #'+json.insertedVenta.consecutivoVenta+'.'
				    	},{
				    		type: 'success',
				    		z_index: 2000,
				    	});
						lastB=0.0;
						listaProductosAgregadosAVenta=[];
						$('#tableSell').html('');
						$("#inputCantidadEfectivo").val('');
						$("#changeAmount").text('0');
						$("#totalSellAmount").text('Total:0');
						
						if(tableSell==1){
							//marcamos la orden de la mesa como cobrada estatus 4
							tableSell=0;
							//
							dataToSend={
				    				noMesa:tableSelected,
				    				estatusOrden:4
				    		}
				    		
							$.ajax({
							    url: urlPrefix+"/updateStatusOrderTable",
							    type: "POST",
							    dataType : "json",
							    data:JSON.stringify(dataToSend),
							    headers: { 
							        'Accept': 'application/json',
							        'Content-Type': 'application/json' 
							    },
							}).done(function( json ) {
								console.log(json);
								tableSelected=0;
								//sibok
							}).fail(function( xhr, status, errorThrown ) {
								//console.log( "Sorry, there was a problem!" );
							    console.log( "Error: " + errorThrown );
							    console.log( "Status: " + status );
							    //console.dir( xhr );
							}).always(function( xhr, status ) {
							    //console.log( "The request is complete!" );
							});
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
			calcSellAmount : function() {
				var table = $("#tableSell");
				index=1;
				totalSum=0.0;
			    table.find('tr').each(function (i) {
			        var $tds = $(this).find('td'),
			            productId = $tds.eq(0).text(index),
			            subtotal=$tds.eq(4).text();
			        	subtotal=subtotal.replace('$','');
			        totalSum=totalSum+parseFloat(subtotal);
			        index++;
			    });
			    $("#totalSellAmount").text("Total: "+totalSum);
			    lastB=totalSum;
			},
			undoneRemoveRow : function(element) {
				$("#tableSell").html(originalTable);
				events.calcSellAmount();
			},
			removeRow : function(element) {
				lastProductRemoved=$("#sellRow"+element).html();

				originalTable=$("#tableSell").html();
				$("#sellRow"+element).remove();
				events.calcSellAmount();
				
		    	$.notify({
		    		title: '<strong>Error!</strong>',
		    		message: 'Se elimino un producto. <a onclick="ventas.events.undoneRemoveRow('+element+');">Deshacer</a>'
		    	},{
		    		type: 'danger',
		    		z_index: 2000,
		    	});
			},
			addProductToSell : function() {
				console.log("producto agregado");
				lastIdItemAdded=lastIdItemAdded+1;
				//productsStringSell='<tr>';
				productsStringSell='<tr id="sellRow'+lastIdItemAdded+'"><td id="sellRowNumber'+lastIdItemAdded+'">' + lastIdItemAdded + '</td>'+productsStringSell;
				
				productsStringSell=productsStringSell.replace("idxxx",lastIdItemAdded);
				
				
		    	$("#tableSell").append(productsStringSell);
		    	currentProductFromSearch='';
		    	$("#addToSellButton").attr("disabled", true);
		    	$("#modal-producto-seleccion").modal('hide');
		    	events.calcSellAmount();
		    	productoAAgregarOriginal.cantidadAgregada=inputCantidad;
		    	productoAAgregarOriginal.cantidadRestante=productoAAgregarOriginal.cantidadOriginal-inputCantidad;
		    	listaProductosAgregadosAVenta[productoAAgregarOriginal.idProducto]=productoAAgregarOriginal;
		    	productoAAgregarOriginal={};
		    	inputCantidad=0.0;
		    	$("#inputDescripcion").val('');
		    	$("#inputCodigo").val('');
		    	$("#inputCantidad").val(''); 
			},
			getProductByDescription : function() {
				console.log("buscando producto por descripcion");
				description=$("#inputDescripcion").val();
				$.ajax({
				    url: urlPrefix+"/getProductByDescription/"+description,
				    type: "GET",
				}).done(function( json ) {
					console.log("Getting product by desc");
					console.log(json);
					$("#tableBusqueda").html('');
					var preTable=$('#tableBusquedaProductos').DataTable();
					preTable.destroy();
					var productsString="";
					$('#inputCantidadAgregar').val('');
					$('#tableProductoAAgregar').html('');
					for(i=0;i<json.listaProductosPorDescripcion.length;i++){
						currentProducto=json.listaProductosPorDescripcion[i];
						
						productoRestante=listaProductosAgregadosAVenta[currentProducto.id];
						
						if(typeof(productoRestante)==='undefined'){
							productsString=productsString + '<tr>'+
			                '<td>'+currentProducto.id+'</td>'+
							'<td>'+ currentProducto.descripcion+'</td>'+
			                '<td>'+currentProducto.unidadesEnCaja +'</td>'+
							'<td>'+currentProducto.precioVenta.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });+'</td>'+
			                '</tr>;'	
						}else{
							productsString=productsString + '<tr>'+
			                '<td>'+currentProducto.id+'</td>'+
							'<td>'+ currentProducto.descripcion+'</td>'+
			                '<td>'+productoRestante.cantidadRestante +'</td>'+
							'<td>'+currentProducto.precioVenta.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });+'</td>'+
			                '</tr>;'
						}
					}	
					$("#tableBusqueda").html(productsString);
					 var table = $('#tableBusquedaProductos').DataTable({
				        'paging'      : true,
				        'lengthChange': false,
				        'searching'   : true,
				        'ordering'    : true,
				        'info'        : true,
				        'autoWidth'   : false
				    });
				    
				    $('#tableBusquedaProductos tbody').on( 'click', 'tr', function () {
						$row=$(this);
						currentProductFromSearch=$row;
						$tds = $row.find("td");             // Finds all children <td> elements
						//clean the form
				    	$('#tableProductoAAgregar').html('');
						index=0;
						var productsString='<tr>';
						
						$.each($tds, function() {               // Visits every single <td> element
						    switch(index){
						    	case 0:
						    		productsString=productsString+'<td>' + $(this).text() + '</td>';
						    	break;	
						    	case 1:
						    		productsString=productsString+'<td>'+ $(this).text() + '</td>';
						    	break;	
						    	case 2:
						    		productsString=productsString+'<td id="avaliableQty">'+ $(this).text() + '</td>';
						    		productsString=productsString+'<td><input type="text" class="form-control" id="inputCantidadAgregar" placeholder="Introduce la cantidad que deseas agregar"></td>';
						    	break;	
						    }
						    index++;
						});
				    	
						
						productsString=productsString + '</tr>';    
		                  					
						
				    	$('#tableProductoAAgregar').html(productsString);
				    	
				    	
						var timerC = null;
						$('#inputCantidadAgregar').keydown(function(){
							   $("#addToSellButton").attr("disabled", true);
						       clearTimeout(timerC); 
						       timerC = setTimeout(doCallToValidate, 1000)
						});

						function doCallToValidate() {
							qtyAdd=parseFloat($("#inputCantidadAgregar").val());
							inputCantidad=qtyAdd;
							avaliableQty=parseFloat($("#avaliableQty").html());
						    if(qtyAdd>avaliableQty){
						    	//types of notifications 
						    	//warning
						    	//success
						    	$.notify({
						    		title: '<strong>Error!</strong>',
						    		message: 'NO se puede agregar, no existen cantidad suficiente en almacen.'
						    	},{
						    		type: 'danger',
						    		z_index: 2000,
						    	});
						    }else{
						    	//lastIdItemAdded=lastIdItemAdded+1;
						    	$("#addToSellButton").attr("disabled", false);
						    	$tds = $row.find("td");
						    	productsStringSell='';

						    	index=0;
						    	$.each($tds, function() {               // Visits every single <td> element
									stPrice=0.0;
									
								    switch(index){
								    	case 0:
								    		//id
								    		productoAAgregarOriginal.idProducto=$(this).text();
								    		//productsStringSell=productsStringSell+'<td id="idProduct'+lastIdItemAdded+'">' + $(this).text() + '</td>';
								    	break;	
								    	case 1:
								    		productoAAgregarOriginal.descripcion=$(this).text();
								    		//descripcion
								    		productsStringSell=productsStringSell+'<td>'+ $(this).text() + '</td>';
								    	break;	
								    	case 2:
								    		//cantidadAgregada
								    		productoAAgregarOriginal.cantidadOriginal=parseFloat($(this).text());
								    		productsStringSell=productsStringSell+'<td id="addedQty'+lastIdItemAdded+'">'+ qtyAdd + '</td>';
								    	break;
								    	case 3:
								    		//precio
								    		precioSinSigno=$(this).text().replace('$','');
								    		stPrice=parseFloat(precioSinSigno);
								    		productoAAgregarOriginal.precio=precioSinSigno;
								    		productsStringSell=productsStringSell+'<td id="price'+lastIdItemAdded+'">'+ $(this).text() + '</td>';
								    	break;
								    }
								    index++;
								});
								
								stPrice=stPrice*qtyAdd;
								//agregando precio subtotal
								productsStringSell=productsStringSell + '<td id="stPrice'+lastIdItemAdded+'">$'+ stPrice + '</td>';    
						    	
								//agregar botones de eliminar y modificar
								productsStringSell=productsStringSell +'<td><div class="btn-group">'+
							    '<div class="btn-group">'+
							    '	<button type="button" class="btn btn-default">Modificar cantidad</button>'+
							    '	<button type="button" class="btn btn-default" disabled>|</button>'+
							    '	<button type="button" class="btn btn-danger" onclick="ventas.events.removeRow(idxxx)">Eliminar producto</button>'+
								'</div> </td>';							
								productsStringSell=productsStringSell + '</tr>';  
						    	
						    }
						}
				    	
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
			getProductByCode : function() {

				codigo= $("#inputCodigo").val();
				
				$.ajax({
				    url: urlPrefix+"/getProductByCode/"+codigo,
				    type: "GET",
				}).done(function( json ) {
					console.log("Get producto by code");
					console.log(json);
					var productsString="";
					for(i=0;i<json.listaProductosPorCodigo.length;i++){
						currentProducto=json.listaProductosPorCodigo[i];
						cantidadAgregar=$("#cantidadCodigo").val() != "" ? parseFloat($("#cantidadCodigo").val()) : 1.0;
						cantidadSubtotal=currentProducto.precioVenta*cantidadAgregar;
						
						productsString=productsString + '<tr>'+
										                '<td>'+currentProducto.id+'</td>'+
														'<td>'+ currentProducto.descripcion+'</td>'+
										                '<td>'+ cantidadAgregar +'</td>'+
														'<td>'+currentProducto.precioVenta.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });+'</td>'+
														'<td>'+cantidadSubtotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });+'</td>'+
														'<td><a idMod="'+fila.id+'" class="btn btn-block btn-primary" onclick="" type="button">Modificar</a></td>'+
														'<td><a idDel="'+fila.id+'" class="btn btn-block btn-danger" onclick="" type="button">Eliminar</a></td>'+
										                '</tr>;'
					}
					if(json.listaProductosPorCodigo.length>0){
						$("#tableSell").append(productsString);
						events.calcSellAmount();
					}else{
						///show notification not found product by code
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
			listAllProducts : function() {
				$.ajax({
				    url: urlPrefix+"/getAllProducts",
				    type: "GET",
				}).done(function( json ) {
					console.log("Get all products");
					console.log(json);
					
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
	ventas.init();
});

function navegacion(element){
	console.log("iniciando clientes-----------------------");
	ventas.events.changeView(element.id);
}
