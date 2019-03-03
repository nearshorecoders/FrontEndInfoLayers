/**@author asr*/

var usuarios = (function() {

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
			getDetailUser : function(element) {
				
				$row=$("#table"+element);
				$tds = $row.find("td");             // Finds all children <td> elements
				events.cleanUpdateUserFields();
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
				    		$('#inputNombreUsuarioMod').val($(this).text());
				    	break;	
				    	case 2:
				    		$('#inputApellidoPUsuarioMod').val($(this).text());
				    	break;	
				    	case 3:
				    		$('#inputApellidoMUsuarioMod').val($(this).text());
				    	break;
				    	case 4:
				    		$('#inputUsuarioMod').val($(this).text());
				    	break;	
				    	case 5:
				    		$('#inputPassMod').val('');
				    		$('#inputPassConfirmMod').val('');
				    	break;
				    	case 6:
				    		if($(this).text()=="Activo"){
				    			$('#inputEstatusMod').val(1);
				    		}else if($(this).text()=="Inactivo"){
				    			$('#inputEstatusMod').val(0);	
				    		}
				    	break;	
				    	case 7:
				    		if($(this).text()=="Administrador"){
				    			$('#rolMod').val(2);
				    		}else if($(this).text()=="Supervisor"){
				    			$('#rolMod').val(3);	
				    		}else if($(this).text()=="Vendedor"){
				    			$('#rolMod').val(4);	
				    		}else if($(this).text()=="Mesero"){
				    			$('#rolMod').val(5);	
				    		}
				    		//$('#rolMod').val($(this).text());
				    	break;	
				    }
				    
				    index++;
				});
				
				$('#modal-user-detalle').modal('show');
			},
			cleanUserFields : function() {
				$("#inputNombreUsuario").val('');
				$("#inputApellidoPUsuario").val('');
				$("#inputApellidoMUsuario").val('');
				$("#inputUsuario").val('');
				$("#inputPass").val('');
				$("#inputPassConfirm").val('');
				$("#inputEstatus").val('');
				$("#inputRol").val('2');
			},
			cleanUpdateUserFields : function() {
				$("#inputIdMod").val('');
				$("#inputNombreUsuarioMod").val('');
				$("#inputApellidoPUsuarioMod").val('');
				$("#inputApellidoMUsuarioMod").val('');
				$("#inputUsuarioMod").val('');
				$("#inputPassMod").val('');
				$("#inputPassConfirm").val('');
				$("#inputEstatusMod").val('');
				$("#rolMod").val('2');
			},
			filterTables : function() {
				// Declare variables 
				console.log("Filtrar usuarios");
				  var input, filter, table, tr, td, i, txtValue;
				  input = document.getElementById("searchUser");
				  filter = input.value.toUpperCase();
				  table = document.getElementById("tableUsersAll");
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
			getAllUsers : function() {
				$.ajax({
				    url: urlPrefix+"/getUsers",
				    type: "GET",
				}).done(function( json ) {
					console.log("Getting all users");
					console.log(json);
					$("#tableUsers").html("");
					
					stringTableClients="";
					for(i=0;i<json.ListaUsuariosTodos.length;i++){
						usuarioActual=json.ListaUsuariosTodos[i];
						stringTableClients=stringTableClients+'<tr id="table'+usuarioActual.id+'">'
											+'<td>'+usuarioActual.id+'</td>'
											+'<td>'+usuarioActual.nombre+'</td>'
											+'<td>'+usuarioActual.apellidop+'</td>'
											+'<td>'+usuarioActual.apellidom+'</td>'
											+'<td>'+usuarioActual.email+'</td>'
											+'<td>********</td>';
						var estatusLetra='';
						if(usuarioActual.estatus=='1'){
							estatusLetra='Activo';
						}else if(usuarioActual.estatus=='0'){
							estatusLetra='Inactivo';
						}
						
						var rolLetra='';
						if(usuarioActual.idRol=='2'){
							rolLetra='Administrador';
						}else if(usuarioActual.idRol=='3'){
							rolLetra='Supervisor';
						}else if(usuarioActual.idRol=='4'){
							rolLetra='Vendedor';
						}else if(usuarioActual.idRol=='5'){
							rolLetra='Mesero';
						}
						
						stringTableClients=stringTableClients+'<td>'+estatusLetra
											+'</td>'+'<td>'+rolLetra+'</td>'
											+'<td><a type="submit" class="btn btn-info pull-left" onclick="usuarios.events.getDetailUser('+usuarioActual.id+');">Detalle</a></td>'
											+'</tr>';
						//console.log(stringTableClients);
					}
					
					$("#tableUsers").html(stringTableClients);
					
				}).fail(function( xhr, status, errorThrown ) {
					//console.log( "Sorry, there was a problem!" );
				    console.log( "Error: " + errorThrown );
				    console.log( "Status: " + status );
				    //console.dir( xhr );
				}).always(function( xhr, status ) {
				    //console.log( "The request is complete!" );
				});
				
			},
			updateUser : function() {
				
				
				dataToSend={
				    idUser:$("#inputIdMod").val(),
					nombre:$("#inputNombreUsuarioMod").val(),
					apellidop:$("#inputApellidoPUsuarioMod").val(),
					apellidom:$("#inputApellidoMUsuarioMod").val(),
					email:$("#inputUsuarioMod").val(),
					password:$("#inputPassMod").val(),
					estatus:$("#inputEstatusMod").val(),
					idRol:$("#rolMod").val(),
					nombreRol:events.getSelectedTextFromSelect("rolMod"),
				}
				
				
				$.ajax({
					
				    url: urlPrefix+"/updateUser",
				    type: "PUT",
				    dataType : "json",
				    data:JSON.stringify(dataToSend),
				    headers: { 
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				    },
				    
				}).done(function( json ) {
					console.log("updating user");
					console.log(json);
					events.cleanUpdateUserFields();
					events.getAllUsers();
			    	$.notify({
			    		title: '<strong>Se actualizó el usuario correctamente </strong>',
		    			message: ''
			    	},{
			    		type: 'success',
			    		z_index: 2000,
			    	});
			    	$('#modal-user-detalle').modal('hide');
				}).fail(function( xhr, status, errorThrown ) {
					//console.log( "Sorry, there was a problem!" );
				    console.log( "Error: " + errorThrown );
				    console.log( "Status: " + status );
				    $('#modal-user-detalle').modal('hide');
				    //console.dir( xhr );
				}).always(function( xhr, status ) {
				    //console.log( "The request is complete!" );
				});
				
			},
			createNewUser : function() {
				dataToSend={
						nombre:$("#inputNombreUsuario").val(),
						apellidop:$("#inputApellidoPUsuario").val(),
						apellidom:$("#inputApellidoMUsuario").val(),
						email:$("#inputUsuario").val(),
						password:$("#inputPass").val(),
						estatus:$("#inputEstatus").val(),
						idRol:$("#inputRol").val(),
						nombreRol:events.getSelectedTextFromSelect("rolMod"),
				}
				$.ajax({
					
				    url: urlPrefix+"/createUser",
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
					events.cleanUserFields();
					events.getAllUsers();
			    	$.notify({
			    		title: '<strong>Se creo el usuario correctamente </strong>',
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
		getSelectedTextFromSelect:function(elementId){
			var elt = document.getElementById(elementId);

			if (elt.selectedIndex == -1)
			        return null;
			return elt.options[elt.selectedIndex].text;
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
	usuarios.init();
	usuarios.events.getAllUsers();
});

function navegacion(element){
	console.log("iniciando usuarios-----------------------");
	usuarios.events.changeView(element.id);
}
