(function () {
    'use strict';

    angular.module('UserCreateControllerModule', [])

        .controller('userCreateController', ['$scope', 'AuthService', '$state',
            function ($scope, AuthService, $state) {

                $scope.title = "CollabAll - User Registration";
                $scope.validation = [];

                $scope.createUser = function () {
                    if (isFormValid()) {
                        document.getElementById("overlayScreen").style.width = "100%";
                        document.getElementById("overlayScreen").style.height = "100%";

                        $scope.status = "Creating User....";
                        AuthService.register({
                            email: $scope.email,
                            password: $scope.password,
                            firstName: $scope.firstName,
                            lastName: $scope.lastName
                        }).then(function () {
                                $scope.status ='User Created!';

                                AuthService.login({
                                    email: $scope.email,
                                    password: $scope.password,
                                })
                                    .then(function() {
                                        $scope.authenticationStatus = "Login success!";
                                        $state.go('inside.home');
                                    }, function(errMsg) {
                                        console.log(errMsg);
                                    });

                                document.getElementById("overlayScreen").style.width = "0%";
                                document.getElementById("overlayScreen").style.height = "0%";
                            },
                            function (error) {
                                console.log(error);
                                document.getElementById("overlayScreen").style.width = "0%";
                                document.getElementById("overlayScreen").style.height = "0%";

                                $scope.validation = [];
                                $scope.validation.push("The email address has already been registered.");
                                $scope.status ='';
                            });
                    }
                };

                function isFormValid() {
                    $scope.validation = [];

                    if (!$scope.firstName) {
                        $scope.validation.push("First Name is a required field");
                    }

                    if (!$scope.email) {
                        $scope.validation.push("Email is a required field");
                    }

                    if (!$scope.password) {
                        $scope.validation.push("Password is a required field");
                    }

                    if ($scope.password !== $scope.password2) {
                        $scope.validation.push("Password fields must match");
                    }

                    if ($scope.validation.length >= 1) {
                        console.log('form not valid');
                        return false;
                    }

                    return true;
                }

            }]);


}());
