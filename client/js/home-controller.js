(function () {
    'use strict';

    angular.module('HomeControllerModule', ['AuthModule'])

        .controller('homeController', ['$scope', '$state', '$http','AuthService','$window', function($scope, $state, $http, AuthService,$window) {

            var user = 'userid=' + $scope.userID;
            var socket = io.connect({query: user});
            socket.on('notification message', function (msg) {
                alert(msg);
                $scope.hasNotifications = true;
                $scope.$apply();
            });
            console.log(socket);

            $scope.title = "CollabAll";
            $scope.user =  AuthService.authenticatedUser();

            if ($window.DeviceMotionEvent) {
                $window.addEventListener("devicemotion", motion, true);
                $scope.deviceMotion = "[devicemotion] Accelerometer: ";
            }
            else{
                alert("DeviceMotionEvent NOT supported");
            }

            if ($window.DeviceOrientationEvent) {
                $window.addEventListener("deviceorientation", orientation, true);
                $scope.deviceOrientation = "[deviceorientation] Magnetometer: ";
            }
            else{
                alert("DeviceOrientation NOT supported");
            }

            function motion(event){
                $scope.deviceMotion = "Accelerometer: "
                    + event.accelerationIncludingGravity.x + ", "
                    + event.accelerationIncludingGravity.y + ", "
                    + event.accelerationIncludingGravity.z
            }

            function orientation(event){
                var mag_text = "Magnetometer: "
                    + event.alpha + ", "
                    + event.beta + ", "
                    + event.gamma;
                $scope.deviceOrientation = mag_text;
                alert(mag_text);
                alert('scp: ' + $scope.deviceOrientation);
            }

            $scope.dowork = function () {
                $scope.deviceMotion = "Hello "+ Date.now();
            };


        }]);

}());
