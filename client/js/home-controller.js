(function () {
    'use strict';

    angular.module('HomeControllerModule', ['AuthModule'])

        .controller('homeController', ['$scope', '$state', 'AuthService', function($scope, $state, AuthService) {

            $scope.title = "CollabAll";
            $scope.user =  AuthService.authenticatedUser();

            $scope.logout = function() {
                AuthService.logout();
                $state.go('login');
            };

        }]);

}());
