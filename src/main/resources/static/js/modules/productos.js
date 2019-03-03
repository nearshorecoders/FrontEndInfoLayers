/**@author asr*/

var productos = (function() {

	var title = document.title;
	var favicon = "";
	var domain = window.location.pathname.replace("index", "");
	
	var currentWall;
	var pathArray = window.location.pathname;
	var stompClient = null;
	var stompClientChat = null;
	var urlPrefix="/businesstools";
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
		events.cleanProductFields();
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
			cleanProductFields : function() {
			    $('#inputCodigo').val('');
			    $('#inputDescripcion').val('');
			    $('#inputCantidad').val('');
			    $('#inputPrecioCompra').val('');
			    $('#inputPrecioVenta').val('');
			    $('#inputCantidadAceptable').val('');
			    $('#inputCantidadMinima').val('');
				$("#urlImagen1").val('');
				$("#urlImagen2").val('');
				$("#urlImagen3").val('');
				$("#imagenIzquierda").val('');
				$("#imagenFrontal").val('');
				$("#imagenDerecha").val('');
			},
			cleanUpdateProductFields : function() {
				$('#inputCodigoIdMod').val('');
			    $('#inputCodigoMod').val('');
			    $('#inputDescripcionMod').val('');
			    $('#inputCantidadMod').val('');
			    $('#inputPrecioCompraMod').val('');
			    $('#inputPrecioVentaMod').val('');
			    $('#inputCantidadAceptableMod').val('');
			    $('#inputCantidadMinimaMod').val('');
				$("#urlImagen1Mod").val('');
				$("#urlImagen2Mod").val('');
				$("#urlImagen3Mod").val('');
				$("#imagenIzquierdaMod").val('');
				$("#imagenFrontalMod").val('');
				$("#imagenDerechaMod").val('');
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
			uploadFileImage1:function(){
				console.log("subiendo archivo");
				var file = $('#imagenIzquierda');
			    //var imgContainer = $('#imgContainer');
				var filename = $.trim(file.val());
			    marcaString=events.getSelectedTextFromSelect("selectMarca");
			    codigoUnicoString=$("#inputCodigo").val();
			    
			    if(marcaString=="" || codigoUnicoString==""){
			    	$.notify({
			    		title: '<strong>Es necesario seleccionar marca y proporcionar código </strong>',
		    			message: ''
			    	},{
			    		type: 'danger',
			    		z_index: 2000,
			    	});
			    	return;
			    }
			    
			    if(marcaString=="---"){
			    	marcaString=="generic";
			    }
			    
			    fullFileName=marcaString+"_"+codigoUnicoString+"_"+"imagen1";
			    
				var isJpg = function(name) {
				    return name.match(/jpg$/i)
				};
				    
				var isPng = function(name) {
				    return name.match(/png$/i)
				};
				
			        if (!(isJpg(filename) || isPng(filename))) {
				    	$.notify({
				    		title: '<strong>Proporciona una imagen en formato JPG/PNG </strong>',
			    			message: ''
				    	},{
				    		type: 'danger',
				    		z_index: 2000,
				    	});
			            return;
			        }
			        
			        //formDataToSend=new FormData(document.getElementById("formAltaProductos"));
			        
			        formDataToSend=new FormData();
			        formDataToSend.append("imagenIzquierda",$("#imagenIzquierda")[0].files[0]);
			        formDataToSend.append("fileName",fullFileName);
			        
			        $.ajax({
			            url: urlPrefix+'/uploadFile',
			            type: "POST",
			            data: formDataToSend,
			            enctype: 'multipart/form-data',
			            processData: false,
			            contentType: false
			          }).done(function(data) {
			        	  console.log("Upload ok...");
			        	  console.log(data);
			        	  
					    	$.notify({
					    		title: '<strong>Se subio la imagen 1 correctamente </strong>',
				    			message: ''
					    	},{
					    		type: 'success',
					    		z_index: 2000,
					    	});
					    	$('#urlImagen1').val(data);
					    	
			          }).fail(function(jqXHR, textStatus) {
			              //alert(jqXHR.responseText);
					    	$.notify({
					    		title: '<strong>Ocurrio un error al subir la imagen 1, intente nuevamente </strong>',
				    			message: ''
					    	},{
					    		type: 'danger',
					    		z_index: 2000,
					    	});
			          });
			},
			uploadFileImage2:function(){
				console.log("subiendo archivo");
				var file = $('#imagenFrontal');
			    //var imgContainer = $('#imgContainer');
				var filename = $.trim(file.val());
			    marcaString=events.getSelectedTextFromSelect("selectMarca");
			    codigoUnicoString=$("#inputCodigo").val();
			    
			    if(marcaString=="" || codigoUnicoString==""){
			    	$.notify({
			    		title: '<strong>Es necesario seleccionar marca y proporcionar código </strong>',
		    			message: ''
			    	},{
			    		type: 'danger',
			    		z_index: 2000,
			    	});
			    	return;
			    }
			    
			    if(marcaString=="---"){
			    	marcaString=="generic";
			    }
			    
			    fullFileName=marcaString+"_"+codigoUnicoString+"_"+"imagen2";
			    
				var isJpg = function(name) {
				    return name.match(/jpg$/i)
				};
				    
				var isPng = function(name) {
				    return name.match(/png$/i)
				};
				
			        if (!(isJpg(filename) || isPng(filename))) {
				    	$.notify({
				    		title: '<strong>Proporciona una imagen en formato JPG/PNG </strong>',
			    			message: ''
				    	},{
				    		type: 'danger',
				    		z_index: 2000,
				    	});
			            return;
			        }
			        
			        //formDataToSend=new FormData(document.getElementById("formAltaProductos"));
			        
			        formDataToSend=new FormData();
			        formDataToSend.append("imagenIzquierda",$("#imagenFrontal")[0].files[0]);
			        formDataToSend.append("fileName",fullFileName);
			        
			        $.ajax({
			            url: urlPrefix+'/uploadFile',
			            type: "POST",
			            data: formDataToSend,
			            enctype: 'multipart/form-data',
			            processData: false,
			            contentType: false
			          }).done(function(data) {
			        	  console.log("Upload ok...");
			        	  console.log(data);
			        	  
					    	$.notify({
					    		title: '<strong>Se subio la imagen 2 correctamente </strong>',
				    			message: ''
					    	},{
					    		type: 'success',
					    		z_index: 2000,
					    	});
					    	$('#urlImagen2').val(data);
					    	
			          }).fail(function(jqXHR, textStatus) {
			              //alert(jqXHR.responseText);
					    	$.notify({
					    		title: '<strong>Ocurrio un error al subir la imagen 2, intente nuevamente </strong>',
				    			message: ''
					    	},{
					    		type: 'danger',
					    		z_index: 2000,
					    	});
			          });
			},
			uploadFileImage3:function(){
				console.log("subiendo archivo");
				var file = $('#imagenDerecha');
			    //var imgContainer = $('#imgContainer');
				var filename = $.trim(file.val());
			    marcaString=events.getSelectedTextFromSelect("selectMarca");
			    codigoUnicoString=$("#inputCodigo").val();
			    
			    if(marcaString=="" || codigoUnicoString==""){
			    	$.notify({
			    		title: '<strong>Es necesario seleccionar marca y proporcionar código </strong>',
		    			message: ''
			    	},{
			    		type: 'danger',
			    		z_index: 2000,
			    	});
			    	return;
			    }
			    
			    if(marcaString=="---"){
			    	marcaString=="generic";
			    }
			    
			    fullFileName=marcaString+"_"+codigoUnicoString+"_"+"imagen3";
			    
				var isJpg = function(name) {
				    return name.match(/jpg$/i)
				};
				    
				var isPng = function(name) {
				    return name.match(/png$/i)
				};
				
			        if (!(isJpg(filename) || isPng(filename))) {
				    	$.notify({
				    		title: '<strong>Proporciona una imagen en formato JPG/PNG </strong>',
			    			message: ''
				    	},{
				    		type: 'danger',
				    		z_index: 2000,
				    	});
			            return;
			        }
			        
			        //formDataToSend=new FormData(document.getElementById("formAltaProductos"));
			        
			        formDataToSend=new FormData();
			        formDataToSend.append("imagenIzquierda",$("#imagenDerecha")[0].files[0]);
			        formDataToSend.append("fileName",fullFileName);
			        
			        $.ajax({
			            url: urlPrefix+'/uploadFile',
			            type: "POST",
			            data: formDataToSend,
			            enctype: 'multipart/form-data',
			            processData: false,
			            contentType: false
			          }).done(function(data) {
			        	  console.log("Upload ok...");
			        	  console.log(data);
			        	  
					    	$.notify({
					    		title: '<strong>Se subio la imagen 3 correctamente </strong>',
				    			message: ''
					    	},{
					    		type: 'success',
					    		z_index: 2000,
					    	});
					    	$('#urlImagen3').val(data);
					    	
			          }).fail(function(jqXHR, textStatus) {
			              //alert(jqXHR.responseText);
					    	$.notify({
					    		title: '<strong>Ocurrio un error al subir la imagen 3, intente nuevamente </strong>',
				    			message: ''
					    	},{
					    		type: 'danger',
					    		z_index: 2000,
					    	});
			          });
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
						stockString='';
						
						if(typeof(fila.cantidadAceptable)==='undefined' || fila.cantidadAceptable==null){
							fila.cantidadAceptable=fila.unidadesEnCaja;
						}
						
						if(typeof(fila.cantidadMinima)==='undefined' || fila.cantidadMinima==null){
							fila.cantidadMinima=fila.unidadesEnCaja/2;
						}
						
						if(fila.unidadesEnCaja<2){
							stockString='<td><span class="label label-danger">' + fila.cantidadMinima +'</span></td>'
						}else if(fila.unidadesEnCaja>=fila.cantidadAceptable){
							stockString='<td><span class="label label-success">' + fila.cantidadAceptable +'</span></td>'
						}else if(fila.unidadesEnCaja<fila.cantidadAceptable){
							stockString='<td><span class="label label-warning">' + fila.cantidadAceptable +'</span></td>'
						}else if(fila.unidadesEnCaja<=fila.cantidadMinima){
							stockString='<td><span class="label label-danger">' + fila.cantidadMinima +'</span></td>'
						}
						defaultImg1='';
						if(fila.imagen1==null || fila.imagen1=="null"){
							defaultImg1='<img class="img-responsive " src="js/theme/dist/img/opt1.jpg" alt="Photo"/>';
						}else{
							defaultImg1='<img class="img-responsive" src="'+fila.imagen1+'" alt="Photo">';
						}
						defaultImg2='';
						if(fila.imagen2==null || fila.imagen2=="null"){
							defaultImg2='<img class="img-responsive" src="js/theme/dist/img/opt2.jpg" alt="Photo"/>';
						}else{
							defaultImg2='<img class="img-responsive" src="'+fila.imagen2+'" alt="Photo">';
						}
						defaultImg3='';
						if(fila.imagen3==null || fila.imagen3=="null"){
							defaultImg3='<img class="img-responsive" src="js/theme/dist/img/opt3.jpg" alt="Photo"/>';
						}else{
							defaultImg3='<img class="img-responsive" src="'+fila.imagen3+'" alt="Photo">';
						}
						
						contentRow = contentRow+'<tr id="product'+fila.id+'">'+
									'<td>' + fila.id + '</td>'+
									'<td>' + fila.codigo + '</td>'+
									'<td>' + fila.marca + '</td>'+
									'<td>' + fila.descripcion + '</td>'+
									'<td>' + fila.unidadesEnCaja + '</td>'+
									'<td>' + fila.presentacion + '</td>'+
									stockString+
									'<td>$'+fila.precioCompra+'</td>'+
									'<td>$'+fila.precioVenta+'</td>'+
									'<td>'+fila.unidadMedida+'</td>'+
									'<td>'+defaultImg1+'</td>'+
									'<td>'+defaultImg2+'</td>'+
									'<td>'+defaultImg3+'</td>'+
									'<td><a id="'+fila.id+'" class="btn btn-block btn-primary" onclick="productos.events.getProductFromRowSelected(this);" data-toggle="modal"  data-target="#modal-producto-modificar" type="button">Modificar</a></td>'+
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
			createNewProduct : function() {
				
				//unidadMedida="Pieza";
				//prsentacionToSend="Caja";
				
				marcaToSend=events.getSelectedTextFromSelect('selectMarca');
				prsentacionToSend=events.getSelectedTextFromSelect('presentacion');
				unidadMedidaToSend=events.getSelectedTextFromSelect('unidadMedida');
				
				dataToSend={
					codigo : $("#inputCodigo").val(),
					descripcion : $("#inputDescripcion").val(),
					unidades : $("#inputCantidad").val(),
					precioCompra : $("#inputPrecioCompra").val(),
					precioVenta : $("#inputPrecioVenta").val(),
					cantidadMinima : $("#inputCantidadMinima").val(),
					cantidadAceptable : $("#inputCantidadAceptable").val(),
					unidadMedida : unidadMedidaToSend,
					presentacion : prsentacionToSend,
					idSucursal:1,
					marca:marcaToSend,
					imagen1:$("#urlImagen1").val(),
					imagen2:$("#urlImagen2").val(),
					imagen3:$("#urlImagen3").val()
				}
				$.ajax({
					
				    url: urlPrefix+"/createProduct",
				    type: "POST",
				    dataType : "json",
				    data:JSON.stringify(dataToSend),
				    headers: { 
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				    },
				    
				}).done(function( json ) {
					console.log("creating product");
					console.log(json);
					events.getAllProducts();
					events.cleanProductFields();
			    	$.notify({
			    		title: '<strong>Se creo el producto correctamente </strong>',
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
			updateProduct : function() {
				
				marcaToSend=events.getSelectedTextFromSelect('selectMarcaMod');
				prsentacionToSend=events.getSelectedTextFromSelect('presentacionMod');
				unidadMedidaToSend=events.getSelectedTextFromSelect('unidadMedidaMod');
				
				dataToSend={
					id:	$("#inputIdMod").val(),
					codigo : $("#inputCodigoMod").val(),
					descripcion : $("#inputDescripcion").val(),
					unidades : $("#inputCantidad").val(),
					precioCompra : $("#inputPrecioCompra").val(),
					precioVenta : $("#inputPrecioVenta").val(),
					cantidadMinima : $("#inputCantidadMinima").val(),
					cantidadAceptable : $("#inputCantidadAceptable").val(),
					unidadMedida : unidadMedidaToSend,
					presentacion : prsentacionToSend,
					idSucursal:1,
					marca:marcaToSend,
					imagen1:$("#urlImagen1Mod").val(),
					imagen2:$("#urlImagen2Mod").val(),
					imagen3:$("#urlImagen3Mod").val()
				}
				$.ajax({
					
				    url: urlPrefix+"/updateProduct",
				    type: "POST",
				    dataType : "json",
				    data:JSON.stringify(dataToSend),
				    headers: { 
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				    },
				    
				}).done(function( json ) {
					console.log("updating product");
					console.log(json);
					events.getAllProducts();
					events.cleanUpdateProductFields();
			    	$.notify({
			    		title: '<strong>Se actualizó el producto correctamente </strong>',
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
	productos.init();
	productos.events.getAllProducts();
});

function navegacion(element){
	console.log("iniciando clientes-----------------------");
	productos.events.changeView(element.id);
}
