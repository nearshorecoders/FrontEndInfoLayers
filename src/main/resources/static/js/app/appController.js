'use strict'
var module = angular.module('UserManagement', []);
module.controller("UserController", function($scope, $http) {
	 
	 
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
	 
	    // HTTP POST/PUT methods for add/edit user  
	    // Call: http://localhost:8080/employee
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
	});