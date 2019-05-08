'use strict'
angular.module('demo.services', []).factory('UserService', ["$http", "CONSTANTS", function($http, CONSTANTS) {
    var service = {};

    service.getAllUsers = function() {
        return $http.get(CONSTANTS.getAllUsers);
    }

	    // HTTP POST/PUT methods for add/edit user  
	    // Call: http://localhost:8080/employee
	   service.submitUser = function() {
	 
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
    
    return service;
}]);