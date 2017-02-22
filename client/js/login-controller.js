(function () {
    'use strict';

    angular.module('LoginControllerModule', ['AuthModule'])
        .controller('loginController', ['$scope', 'AuthService', '$state', function($scope, AuthService, $state) {
            $scope.authenticationStatus = "";
            $scope.user = {
                email: '',
                password: ''
            };

            $scope.login = function() {
                document.getElementById("overlayScreen").style.width = "100%";
                document.getElementById("overlayScreen").style.height = "100%";

                $scope.authenticationStatus = "Login in-progress...";
                AuthService.login($scope.user)
                    .then(function() {
                        document.getElementById("overlayScreen").style.width = "0%";
                        document.getElementById("overlayScreen").style.height = "0%";
                        $scope.authenticationStatus = "Login success!";
                            $state.go('inside.home');
                    }, function(errMsg) {
                        document.getElementById("overlayScreen").style.width = "0%";
                        document.getElementById("overlayScreen").style.height = "0%";
                        $scope.authenticationStatus = "Authentication failed. Email/Password is incorrect.";
                        console.log(errMsg);
                    });
            };
        }]);
}());
