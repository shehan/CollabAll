(function () {
    'use strict';

    angular.module('MyPasswordControllerModule', [])

        .controller('myPasswordController', ['$scope', 'AuthService', '$state',
            function ($scope, AuthService, $state) {

                $scope.title = "CollabAll - Reset Password";
                $scope.validation = [];

                $scope.userID = AuthService.authenticatedUser().ID;


                $scope.resetPassword = function () {
                    if (isFormValid()) {
                        document.getElementById("overlayScreen").style.width = "100%";
                        document.getElementById("overlayScreen").style.height = "100%";

                        $scope.status = "Updating Password....";
                        AuthService.update({
                            ID:$scope.userID,
                            email: $scope.email,
                            firstName: $scope.firstName,
                            lastName: $scope.lastName
                        }).then(function () {
                                $scope.status ='Password Updated!';

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
