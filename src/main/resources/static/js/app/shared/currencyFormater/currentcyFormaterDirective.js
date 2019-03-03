'use strict';

/**
 * @ngdoc directive
 * @name desFrontendApp.directive:phoneInfo
 * @description
 * # phoneInfo
 * allow you to format a text input field.
 * <input type="text" ng-model="test" format="number" />
 * <input type="text" ng-model="test" format="currency" />
 */
angular.module('desFrontendApp')
    .directive('formatToCurrency', function($filter) {
        return {
            scope: {
                amount: '='
            },
            link: function(scope, el, attrs) {
                // el.val($filter('currency')(scope.amount));

                el.bind('focus', function() {
                    el.val(scope.amount);
                });

                el.bind('input', function() {
                    scope.amount = el.val();
                    scope.$apply();
                });

                el.bind('blur', function() {
                    el.val($filter('currency')(scope.amount));
                });
            }
        };
    });