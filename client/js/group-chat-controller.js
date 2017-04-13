(function () {
    'use strict';

    angular.module('GroupChatControllerModule', [])

        .controller('groupChatController', ['$scope', 'AuthService', '$state', '$http', '$stateParams', '$window',
            function ($scope, AuthService, $state, $http, $stateParams, $window) {

                $scope.title = "CollabAll - Group Chat";
                $scope.contactAuthor = AuthService.authenticatedUser().FirstName + " " + AuthService.authenticatedUser().LastName;
                $scope.contactAuthorAvatar = AuthService.authenticatedUser().Avatar;
                $scope.userID = AuthService.authenticatedUser().ID;
                $scope.groupID = $stateParams.groupID;
                $scope.group = [];
                $scope.groupMembers = [];
                $scope.groupCards = [];
                $scope.groupInterjections = [];
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

                                        $http.get('services/interjection/get-interjections-for-group', {params: {GroupId: $scope.groupID}})
                                            .then(function (response) {

                                                $scope.groupInterjections = response.data.interjections;

                                                $scope.communicateInterjection = {
                                                    Title: "Communicating!",
                                                    Icon: "fa fa-microphone",
                                                    BackgroundColor: "#449d44",
                                                    TextColor: "#ffffff"
                                                };
                                                $scope.groupInterjections.splice(0, 0,$scope.communicateInterjection);

                                                document.getElementById("overlayScreen").style.width = "0%";
                                                document.getElementById("overlayScreen").style.height = "0%";
                                            });
                                    });
                            });
                    });



                /************************START: Button Handler Code************************/
                $scope.issueInterjection = function (interjection) {
                    var action = {
                        body: interjection,
                        user: $scope.contactAuthor,
                        userAvatar: $scope.contactAuthorAvatar,
                        groupID: $scope.groupID
                    };
                    appendChat(action);
                    emitAction(action);
                };

                $scope.communicate = function () {

                    var action = {
                        body: "Communicating!",
                        user: $scope.contactAuthor,
                        userAvatar: $scope.contactAuthorAvatar,
                        groupID: $scope.groupID
                    };
                    appendChat(action);
                    emitAction(action);
                };

                $scope.newCard = function (cardID) {
                    var result = $scope.groupCards.find(function (d) {
                        return d.ID === cardID;
                    });

                    var action = {
                        body: "Discussing: " + result.Title,
                        user: $scope.contactAuthor,
                        userAvatar: $scope.contactAuthorAvatar,
                        groupID: $scope.groupID
                    };
                    appendChat(action);
                    emitAction(action);
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

                    var action = {
                        body: result,
                        user: $scope.contactAuthor,
                        userAvatar: $scope.contactAuthorAvatar,
                        groupID: $scope.groupID
                    };
                    appendChat(action);
                    emitAction(action);
                };
                /************************END: Button Handler Code************************/



                /************************START: Socket Code************************/
                var socket = io.connect({query: $scope.userID});

                socket.on('connect', function (msg) {
                    socket.emit('join', $scope.userID);
                    console.log("client joining server");
                });

                socket.emit("subscribe", {group: $scope.groupID});

                socket.on("disconnect", function () {
                    console.log("client disconnected from server");
                });

                socket.on('interjection', function (data) {
                    console.log('Incoming interjection:', data);
                });

                socket.on('tilt', function (data) {
                    if (data.groupID === $scope.groupID) {
                        var message = {
                            body: data.body,
                            user: data.user,
                            userAvatar: data.userAvatar
                        };
                        appendChat(message);
                    }
                });

                $scope.$on("$destroy", function () {
                    socket.emit("unsubscribe", {group: $scope.groupID});
                });

                function emitAction(action) {
                    socket.emit("deviceTilt", {deviceOrientation: action});
                    $window.navigator.vibrate(200)
                }

                console.log(socket);
                /************************END: Socket Code************************/



                /************************START: Device Motion************************/

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

                    if (event.beta < -90) {
                        $scope.deviceOrientation.beta = -90
                    }


                    $scope.deviceOrientation.beta += 90;
                    $scope.deviceOrientation.gamma += 90;

                    $scope.$apply();

                }

                var pos = '';
                setInterval(function () {
                    if ($state.current.name == 'inside.group-chat') {
                        if ($scope.deviceOrientation.beta >= 40 && $scope.deviceOrientation.beta <= 66)
                            pos = "Don't Understand!";
                        if ($scope.deviceOrientation.beta >= 150 && $scope.deviceOrientation.beta <= 170)
                            pos = "Slow Down!";
                        if ($scope.deviceOrientation.gamma >= 30 && $scope.deviceOrientation.gamma <= 80)
                            pos = "Question!";
                        if ($scope.deviceOrientation.gamma >= 115 && $scope.deviceOrientation.gamma <= 150)
                            pos = "Repeat!";

                        if (pos != '') {
                            if (pos != $scope.prevAction) {
                                $scope.prevAction = pos;
                                var action = {
                                    body: pos,
                                    user: $scope.contactAuthor,
                                    userAvatar: $scope.contactAuthorAvatar,
                                    groupID: $scope.groupID
                                };
                                ;
                                appendChat(action)
                                emitAction(action);
                            }
                        }
                    }

                }, 1000);
                /************************END: Device Motion************************/


                function appendChat(message) {
                    $scope.messages.push(message);
                    $window.document.getElementById('messages').scrollTop = messages.scrollHeight

                    if(message.body.includes === undefined && message.body.Title==="Communicating!"){
                        $scope.currentCommunicating = message.user;
                    }
                    else   if(message.body.includes() !== undefined &&  message.body.includes("Discussing:")){
                        $scope.currentCard = message.body.replace("Discussing:", "");
                    }


                    $scope.$applyAsync()

                    if (message.user != $scope.contactAuthor){
                        $window.navigator.vibrate([150,150])
                    }
                }


                function compare(a, b) {
                    if (a.FirstName < b.FirstName)
                        return -1;
                    if (a.FirstName > b.FirstName)
                        return 1;
                    return 0;
                }

            }]);


}());
