(function () {
    'use strict';

    angular.module('GroupChatControllerModule', [])

        .controller('groupChatController', ['$scope', 'AuthService', '$state', '$http','$stateParams','$window',
            function ($scope, AuthService, $state, $http, $stateParams,$window) {

                $scope.title = "CollabAll - Group Chat";
                $scope.contactAuthor = AuthService.authenticatedUser().FirstName + " " + AuthService.authenticatedUser().LastName;
                $scope.userID = AuthService.authenticatedUser().ID;
                $scope.groupID = $stateParams.groupID;
                $scope.stream='';

                var socket = io.connect({query: $scope.userID});

                socket.on('connect', function(msg){
                    socket.emit('join',$scope.userID);
                    console.log("client joining server");
                });

                socket.emit("subscribe", { group: "1" });

                //     socket.emit("unsubscribe", { group: "1" });

                socket.on("disconnect", function(){
                    console.log("client disconnected from server");
                });

                socket.on('interjection', function(data) {
                    console.log('Incoming interjection:', data);
                });

                socket.on('tilt', function(data) {
                    $scope.stream = $scope.stream + data + "\n";
                    $scope.$apply();
                    $window.document.body.scrollTop = $window.document.body.scrollHeight;
                });

                console.log(socket);

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
                    socket.emit("deviceTilt", { deviceOrientation:  $scope.deviceOrientation });
                }





            }]);


}());
