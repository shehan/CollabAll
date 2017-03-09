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
                var prevAction='';
                $scope.deviceOrientation={};
                $scope.deviceOrientation.alpha='';
                $scope.deviceOrientation.beta='';
                $scope.deviceOrientation.gamma='';

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
                    $scope.deviceOrientation.alpha=event.alpha;
                    $scope.deviceOrientation.beta=event.beta;
                    $scope.deviceOrientation.gamma=event.gamma;
                    $scope.$apply();

                }

                var pos='';
                setInterval(function(){
                    if($scope.deviceOrientation.alpha >= 40 && $scope.deviceOrientation.alpha<=66)
                        pos = "UP";
                    if($scope.deviceOrientation.alpha >= -30 && $scope.deviceOrientation.alpha<=-15)
                        pos = "DOWN";
                    if($scope.deviceOrientation.beta >= 50 && $scope.deviceOrientation.beta<=80)
                        pos = "RIGHT";
                    if($scope.deviceOrientation.beta >= -50 && $scope.deviceOrientation.beta<=-80)
                        pos = "LEFT";

                    if (pos != ''){
                        if(pos != prevAction)
                        {
                            prevAction = pos;
                            socket.emit("deviceTilt", { deviceOrientation:  pos });
                            $window.navigator.vibrate(200);
                        }
                    }

                }, 3000);



            }]);


}());
