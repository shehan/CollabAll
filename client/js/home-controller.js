(function () {
    'use strict';

    angular.module('HomeControllerModule', ['AuthModule'])

        .controller('homeController', ['$scope', '$state', 'AuthService','$window', function($scope, $state, AuthService,$window) {

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

            $scope.motion='...';
            $scope.magnetometer='###';


            if ($window.DeviceMotionEvent) {
                $window.addEventListener("devicemotion", motion, false);
                alert("DeviceMotionEvent is supported");
            }
            else{
                alert("DeviceMotionEvent NOT supported");
            }

            if ($window.DeviceOrientationEvent) {
                $window.addEventListener("deviceorientation", orientation, false);
                alert("DeviceOrientation is supported");
            }
            else{
                alert("DeviceOrientation NOT supported");
            }

            function motion(event){
                $scope.motion = "Accelerometer: "
                    + event.accelerationIncludingGravity.x + ", "
                    + event.accelerationIncludingGravity.y + ", "
                    + event.accelerationIncludingGravity.z;
            }

            function orientation(event){
                $scope.magnetometer = "Magnetometer: "
                    + event.alpha + ", "
                    + event.beta + ", "
                    + event.gamma;
            }

            $scope.logout = function() {
                AuthService.logout();
                $state.go('login');
            };

        }]);

}());
