(function () {
    'use strict';

    angular.module('HomeControllerModule', ['AuthModule'])

        .controller('homeController', ['$scope', '$state', '$http','AuthService','$window', function($scope, $state, $http, AuthService,$window) {

            $scope.title = "CollabAll";
            $scope.user =  AuthService.authenticatedUser();


            if ($window.DeviceMotionEvent) {
                $window.addEventListener("devicemotion", motion, true);
            }
            else{
                alert("DeviceMotionEvent NOT supported");
            }

            if ($window.DeviceOrientationEvent) {
                $window.addEventListener("deviceorientation", orientation, true);
            }
            else{
                alert("DeviceOrientation NOT supported");
            }

            function motion(event){
                $scope.deviceMotion = "Accelerometer: "
                    + event.accelerationIncludingGravity.x + ", "
                    + event.accelerationIncludingGravity.y + ", "
                    + event.accelerationIncludingGravity.z
                $scope.$apply();
            }

            function orientation(event){
                $scope.deviceOrientation = "Magnetometer: "
                    + event.alpha + ", "
                    + event.beta + ", "
                    + event.gamma;
                $scope.$apply();
            }


        }]);

}());
