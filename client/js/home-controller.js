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
                $window.addEventListener("ondevicemotion", motion, false);
                alert("DeviceMotionEvent is supported");
            }
            else{
                alert("DeviceMotionEvent NOT supported");
            }

            if ($window.DeviceOrientationEvent) {
                $window.addEventListener("deviceorientation", orientation, true);
                alert("DeviceOrientation is supported");
            }
            else{
                alert("DeviceOrientation NOT supported");
            }

            function motion(event){
               // alert(event.accelerationIncludingGravity.x);
                $scope.motion = "Accelerometer: "
                    + event.accelerationIncludingGravity.x + ", "
                    + event.accelerationIncludingGravity.y + ", "
                    + event.accelerationIncludingGravity.z
            }

            function orientation(event){
                var mag_text = "Magnetometer: "
                    + event.alpha + ", "
                    + event.beta + ", "
                    + event.gamma;
                alert(mag_text);
                $scope.magnetometer = mag_text;
                alert($scope.magnetometer);
            }

            $scope.logout = function() {
                AuthService.logout();
                $state.go('login');
            };

        }]);

}());
