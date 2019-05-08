'use strict'
//aqui registramos todos los eneventos de la vista
//Hacemos referencia al modulo padre, en este caso UserManagement
var module = angular.module('UserManagement', ["$scope", "UserService"]);

//Registramos el controlador User controller en los controladores de la aplicacion.
module.controller("UserController", function($scope, UserService) {
		var ctrl=this; 
	
	    $scope.users = [];
	    $scope.userForm = {
	        id: -1,
	        email: "",  
	        firstName: "",
			lastName:"",
			createdBy:"front",
			createdAt:"2019-02-10 00:00:00",
			updatedAt:"2019-02-10 00:00:00",
			updatedBy:"front"
	    };
	 
	    // Now load the data from server
	    _refreshUserData();
	 
	    $scope.submitUser = function() {
	 
	        var method = "";
	        var url = "";
	 
	        if ($scope.userForm.id == -1) {
	            method = "POST";
	            url = 'http://localhost:8080/api/v1/user';
	        } else {
	            method = "PUT";
	            url = 'http://localhost:8080/api/v1/user/' + $scope.userForm.id;
	        }
	 
	        $http({
	            method: method,
	            url: url,
	            data: angular.toJson($scope.userForm),
	            headers: {
	                'Content-Type': 'application/json'
	            }
	        }).then(_success, _error);
	    };
	 
	    $scope.createUser = function() {
	        _clearFormData();
	    }
	 
	    // HTTP DELETE- delete user by Id
	    // Call: http://localhost:8080/employee/{empId}
	    $scope.deleteUser = function(user) {
	        $http({
	            method: 'DELETE',
	            url: 'http://localhost:8080/api/v1/user/' + user.id
	        }).then(_success, _error);
	    };
	 
	    // In case of edit
	    $scope.editUser = function(user) {
	        $scope.userForm.id = user.id;
	        $scope.userForm.email = user.email;
	        $scope.userForm.firstName = user.firstName;
			$scope.userForm.lastName = user.lastName;
	    };
	 
	    // Private Method  
	    // HTTP GET- get all users collection
	    // Call: http://localhost:8080/employees
	    function _refreshUserData() {
			console.log('Here....');
		
	        $http({
	            method: 'GET',
	            url: 'http://localhost:8080/api/v1/users'
	        }).then(
	            function(res) { // success
	                $scope.users = res.data;
	            },
	            function(res) { // error
	                console.log("Error: " + res.status + " : " + res.data);
	            }
	        );
	    }
	 
	    function _success(res) {
	        _refreshUserData();
	        _clearFormData();
	    }
	 
	    function _error(res) {
	        var data = res.data;
	        var status = res.status;
	        var header = res.header;
	        var config = res.config;
	        alert("Error: " + status + ":" + data);
	    }
	 
	    // Clear the form
	    function _clearFormData() {
	        $scope.userForm.id = -1;
	        $scope.userForm.email = "";
	        $scope.userForm.firstName = "";
			$scope.userForm.lastName = "";
	    };
	
	    function constructMenu() {
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
											'<li class="treeview" id="menuParent'+arregloMenu[i].numberIndex + '" >'+
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
						stringMenuDinamico=  '<li id=menuChildren"'+arregloMenu[i].numberIndex+'" data-fatherLevel="'+levelFather+'"><a onclick="layout.events.changeView(\''+arregloMenu[i].urlAction+'\');"><i class="fa fa-circle-o"></i> '+ arregloMenu[i].nombreModulo +'</a></li>';
						
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
    	};//end construct menu
	
		var onInit = function() {
			constructMenu();
    	};
	
    	onInit();
	});