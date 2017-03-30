(function () {
    'use strict';

    angular.module('MyProfileControllerModule', [])

        .controller('myProfileController', ['$scope', 'AuthService', '$state','$window',
            function ($scope, AuthService, $state, $window) {

                $scope.title = "CollabAll - My Profile";
                $scope.validation = [];

                $scope.userID = AuthService.authenticatedUser().ID;
                $scope.email = AuthService.authenticatedUser().Email;
                $scope.firstName = AuthService.authenticatedUser().FirstName;
                $scope.lastName = AuthService.authenticatedUser().LastName;

                $scope.pic = AuthService.authenticatedUser().Avatar;
                //console.log($scope.pic);

                $scope.saveProfile = function () {
                    if (isFormValid()) {
                        document.getElementById("overlayScreen").style.width = "100%";
                        document.getElementById("overlayScreen").style.height = "100%";

                        $scope.status = "Saving Profile....";
                        AuthService.update({
                            ID:$scope.userID,
                            email: $scope.email,
                            firstName: $scope.firstName,
                            lastName: $scope.lastName,
                            avatar: $scope.pic
                        }).then(function () {
                                $scope.status ='Profile Updated!';

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

                    if (!$scope.lastName) {
                        $scope.validation.push("Last Name is a required field");
                    }

                    if (!$scope.email) {
                        $scope.validation.push("Email is a required field");
                    }

                    if ($scope.validation.length >= 1) {
                        console.log('form not valid');
                        return false;
                    }

                    return true;
                }


                $scope.encodeImageFileAsURL = function(event) {
                    var files = event.files;

                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];

                        var img=file.size;
                        var imgsize=(img/1024)/1024;
                        if(imgsize >=1.0) {
                            alert("Image needs to be less than 1 MB");
                            return;
                        }

                        var reader = new FileReader();
                        reader.onload = $scope.imageIsLoaded;
                        reader.readAsDataURL(file);
                    }
                };

                $scope.imageIsLoaded = function(e){
                    $scope.$apply(function() {
                        $scope.pic = e.target.result;
                        //console .log($scope.pic);
                    });
                }

            }]);


}());
