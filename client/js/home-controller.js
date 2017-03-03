(function () {
    'use strict';

    angular.module('HomeControllerModule', ['AuthModule'])

        .controller('homeController', ['$scope', '$state', 'AuthService', function($scope, $state, AuthService) {

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


            if (window.DeviceOrientationEvent) {
                alert("DeviceOrientation is supported");
                window.addEventListener("devicemotion", motion, false);
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

            $scope.logout = function() {
                AuthService.logout();
                $state.go('login');
            };

        }]);

}());
