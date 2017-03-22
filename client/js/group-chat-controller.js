(function () {
    'use strict';

    angular.module('GroupChatControllerModule', [])

        .controller('groupChatController', ['$scope', 'AuthService', '$state', '$http', '$stateParams', '$window',
            function ($scope, AuthService, $state, $http, $stateParams, $window) {

                $scope.title = "CollabAll - Group Chat";
                $scope.contactAuthor = AuthService.authenticatedUser().FirstName + " " + AuthService.authenticatedUser().LastName;
                $scope.userID = AuthService.authenticatedUser().ID;
                $scope.groupID = $stateParams.groupID;
                $scope.group = [];
                $scope.groupMembers = [];
                $scope.groupCards = [];
                $scope.stream = '';
                $scope.prevAction = '';
                $scope.deviceOrientation = {};
                $scope.deviceOrientation.alpha = '';
                $scope.deviceOrientation.beta = '';
                $scope.deviceOrientation.gamma = '';
                $scope.messages = [];
                $scope.currentCard = '';
                $scope.currentCommunicating = '';


                document.getElementById("overlayScreen").style.width = "100%";
                document.getElementById("overlayScreen").style.height = "100%";

                $http.get('services/group/get-group-members', {params: {GroupId: $scope.groupID}})
                    .then(function (response) {
                        $scope.groupMembers = response.data.users;
                        $scope.groupMembers.sort(compare);

                        $http.get('services/card/get-cards-for-group', {params: {GroupId: $scope.groupID}})
                            .then(function (response) {
                                $scope.groupCards = response.data.cards;

                                $http.get('services/group/get-group-by-id', {params: {GroupId: $scope.groupID}})
                                    .then(function (response) {
                                        $scope.group = response.data.group;
                                        document.getElementById("overlayScreen").style.width = "0%";
                                        document.getElementById("overlayScreen").style.height = "0%";
                                    });
                            });
                    });

                $scope.communicate = function () {
                    var message = {
                        body: "is communicating!",
                        user: $scope.contactAuthor
                    };
                    $scope.messages.push(message);
                    $scope.currentCommunicating = $scope.contactAuthor;
                    $window.document.getElementById('messages').scrollTop = messages.scrollHeight;
                };

                $scope.newCard = function (cardID) {
                    var result = $scope.groupCards.find(function (d) {
                        return d.ID === cardID;
                    });

                    var message = {
                        body: "new discussion card: " + result.Title,
                        user: "john"
                    };
                    $scope.messages.push(message);
                    $scope.currentCard = result.Title;
                    $window.document.getElementById('messages').scrollTop = messages.scrollHeight;
                };

                $scope.interject = function (id) {
                    var result = '';
                    switch (id) {
                        case '1':
                            result = 'Slow Down!';
                            break;
                        case '2':
                            result = 'Question!';
                            break;
                        case '3':
                            result = 'Repeat!';
                            break;
                        case '4':
                            result = 'Don\'t Understand!';
                            break;
                    }

                    var message = {
                        body: "new discussion card: " + result,
                        user: "john"
                    };
                    $scope.messages.push(message);
                    $window.document.getElementById('messages').scrollTop = messages.scrollHeight;
                };


                var socket = io.connect({query: $scope.userID});

                socket.on('connect', function (msg) {
                    socket.emit('join', $scope.userID);
                    console.log("client joining server");
                });

                socket.emit("subscribe", {group: "1"});

                //     socket.emit("unsubscribe", { group: "1" });

                socket.on("disconnect", function () {
                    console.log("client disconnected from server");
                });

                socket.on('interjection', function (data) {
                    console.log('Incoming interjection:', data);
                });

                socket.on('tilt', function (data) {
                    $scope.stream = $scope.stream + data + "\n";
                    $scope.$apply();
                });

                console.log(socket);

                if ($window.DeviceMotionEvent) {
                    $window.addEventListener("devicemotion", motion, true);
                }
                else {
                    alert("DeviceMotionEvent NOT supported");
                }

                if ($window.DeviceOrientationEvent) {
                    $window.addEventListener("deviceorientation", orientation, false);
                }
                else {
                    alert("DeviceOrientation NOT supported");
                }

                function motion(event) {
                    $scope.deviceMotion = "Accelerometer: "
                        + event.accelerationIncludingGravity.x + ", "
                        + event.accelerationIncludingGravity.y + ", "
                        + event.accelerationIncludingGravity.z
                    $scope.$apply();
                }

                function orientation(event) {
                    $scope.deviceOrientation.alpha = event.alpha;
                    $scope.deviceOrientation.beta = event.beta;
                    $scope.deviceOrientation.gamma = event.gamma;

                    if (event.beta > 90) {
                        $scope.deviceOrientation.beta = 90
                    }
                    ;
                    if (event.beta < -90) {
                        $scope.deviceOrientation.beta = -90
                    }
                    ;

                    $scope.deviceOrientation.beta += 90;
                    $scope.deviceOrientation.gamma += 90;

                    $scope.$apply();

                }

                var pos = '';
                setInterval(function () {
                    if ($state.current.name == 'inside.group-chat') {
                        if ($scope.deviceOrientation.beta >= 40 && $scope.deviceOrientation.beta <= 66)
                            pos = "DOWN";
                        if ($scope.deviceOrientation.beta >= 150 && $scope.deviceOrientation.beta <= 170)
                            pos = "UP";
                        if ($scope.deviceOrientation.gamma >= 30 && $scope.deviceOrientation.gamma <= 80)
                            pos = "LEFT";
                        if ($scope.deviceOrientation.gamma >= 115 && $scope.deviceOrientation.gamma <= 150)
                            pos = "RIGHT";

                        if (pos != '') {
                            if (pos != $scope.prevAction) {
                                $scope.prevAction = pos;
                                socket.emit("deviceTilt", {deviceOrientation: pos});
                                $window.navigator.vibrate(200);
                            }
                        }
                    }

                }, 1000);


                function compare(a, b) {
                    if (a.FirstName < b.FirstName)
                        return -1;
                    if (a.FirstName > b.FirstName)
                        return 1;
                    return 0;
                }

            }]);


}());
