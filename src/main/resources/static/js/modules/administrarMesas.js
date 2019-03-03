/**@author asr*/

var administrarMesas = (function() {

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
		
	}
	
	var catchDom = function() {
		
	};
	
	var suscribeEvents = function() {
		events.cleanTableFields();
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
			getDetailTable : function(element) {
				
				$row=$("#table"+element);
				$tds = $row.find("td");             // Finds all children <td> elements

			    //clean the form
				$('#inputIdMod').val('');
			    $('#inputNumeroMod').val('');
			    $('#inputUbicacionMod').val('');
			    $('#inputCapacidadMod').val('');
			    
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
				    		$('#inputNumeroMod').val($(this).text());
				    	break;	
				    	case 2:
				    		$('#inputUbicacionMod').val($(this).text());
				    	break;	
				    	case 3:
				    		$('#inputCapacidadMod').val($(this).text());
				    	break;	
				    }
				    
				    index++;
				});
				
				$('#modal-mesa-detalle').modal('show');
			},
			cleanTableFields : function() {
				$("#tableNumber").val('');
				$("#tableUbicacion").val('');
				$("#tableCapacity").val('');
			},
			cleanUpdateTableFields : function() {
				$("#inputIdMod").val('');
				$("#inputNumeroMod").val('');
				$("#inputUbicacionMod").val('');
				$("#inputCapacidadMod").val('');
			},
			filterTables : function() {
				// Declare variables 
				console.log("Filtrar mesas");
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
				      
				    } 
				  }
				
			},
			getAllTables : function() {
				$.ajax({
				    url: urlPrefix+"/getAllTables",
				    type: "POST",
				}).done(function( json ) {
					console.log("Getting all Tables");
					console.log(json);
					$("#tableTables").html("");
					
					stringTableClients="";
					for(i=0;i<json.listaMesasTodas.length;i++){
						clienteActual=json.listaMesasTodas[i];
						stringTableClients=stringTableClients+'<tr id="table'+clienteActual.idMesa+'">'
											+'<td>'+clienteActual.idMesa+'</td>'
											+'<td>'+clienteActual.numero+'</td>'
											+'<td>'+clienteActual.ubicacion+'</td>'
											+'<td>'+clienteActual.personas+'</td>'
											+'<td><a type="submit" class="btn btn-info pull-left" onclick="administrarMesas.events.getDetailTable('+clienteActual.idMesa+');">Detalle</a></td>'
											+'</tr>';
						//console.log(stringTableClients);
					}
					
					$("#tableTables").html(stringTableClients);
					
				}).fail(function( xhr, status, errorThrown ) {
					//console.log( "Sorry, there was a problem!" );
				    console.log( "Error: " + errorThrown );
				    console.log( "Status: " + status );
				    //console.dir( xhr );
				}).always(function( xhr, status ) {
				    //console.log( "The request is complete!" );
				});
				
			},
			updateTable : function() {
				dataToSend={
				    idMesa:$("#inputIdMod").val(),
					noMesa : $("#inputNumeroMod").val(),
					ubicacion : $("#inputUbicacionMod").val(),
					personas : $("#inputCapacidadMod").val(),
				}
				$.ajax({
					
				    url: urlPrefix+"/updateMesa",
				    type: "POST",
				    dataType : "json",
				    data:JSON.stringify(dataToSend),
				    headers: { 
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				    },
				    
				}).done(function( json ) {
					console.log("updating table");
					console.log(json);
					events.cleanUpdateTableFields();
					events.getAllTables();
			    	$.notify({
			    		title: '<strong>Se actualizó la Mesa correctamente </strong>',
		    			message: ''
			    	},{
			    		type: 'success',
			    		z_index: 2000,
			    	});
			    	$('#modal-mesa-detalle').modal('hide');
				}).fail(function( xhr, status, errorThrown ) {
					//console.log( "Sorry, there was a problem!" );
				    console.log( "Error: " + errorThrown );
				    console.log( "Status: " + status );
				    $('#modal-mesa-detalle').modal('hide');
				    //console.dir( xhr );
				}).always(function( xhr, status ) {
				    //console.log( "The request is complete!" );
				});
				
			},
			createNewTable : function() {
				dataToSend={
					numero : $("#tableNumber").val(),
					ubicacion : $("#tableUbicacion").val(),
					personas : $("#tableCapacity").val(),
				}
				$.ajax({
					
				    url: urlPrefix+"/createMesa",
				    type: "POST",
				    dataType : "json",
				    data:JSON.stringify(dataToSend),
				    headers: { 
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				    },
				    
				}).done(function( json ) {
					console.log("creating table");
					console.log(json);
					events.cleanTableFields();
					events.getAllTables();
			    	$.notify({
			    		title: '<strong>Se creo la Mesa correctamente </strong>',
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
	administrarMesas.init();
	administrarMesas.events.getAllTables();
});

function navegacion(element){
	console.log("iniciando clientes-----------------------");
	administrarMesas.events.changeView(element.id);
}
