
angular.module('UserManagement.services', []).factory('UserService', ["$http", "CONSTANTS", function($http, CONSTANTS) {
    var service = {};

    service.checkFunction = function() {
        return CONSTANTS.getAllUsers;
    }

    return service;
}]);