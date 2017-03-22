(function () {
    'use strict';

    angular.module('CardManageControllerModule', [])

        .controller('cardManageController', ['$scope', 'AuthService', '$state', '$http', '$stateParams',
            function ($scope, AuthService, $state, $http, $stateParams) {

                $scope.title = "CollabAll - Create Card";
                $scope.validation = [];
                $scope.groupID = $stateParams.groupID;
                $scope.cardID = $stateParams.cardID;
                $scope.cardTitle = '';
                $scope.cardDescription = '';

                $scope.allUsers = [];
                $scope.cardUsers = [];

                $scope.selectedAllUsers;
                $scope.selectedCardUsers;


                document.getElementById("overlayScreen").style.width = "100%";
                document.getElementById("overlayScreen").style.height = "100%";

                if ($scope.cardID != "") {
                    $http.get('services/card/get-card-by-id', {params: {CardId: $scope.cardID}})
                        .then(function (response) {
                            $scope.cardTitle = response.data.card.Title;
                            $scope.cardDescription = response.data.card.Description;
                            $scope.cardUsers.push(response.data.card.user);
                        });
                }

                $http.get('services/group/get-group-members', {params: {GroupId: $scope.groupID}})
                    .then(function (response) {
                        $scope.allUsers = response.data.users;
                        $scope.allUsers.sort(compare);

                    }).then(function () {
                            for (var i = 0; i < $scope.cardUsers.length; i++) {
                                for (var j = 0; j < $scope.allUsers.length; j++) {
                                    if ($scope.cardUsers[i].ID == $scope.allUsers[j].ID) {
                                        $scope.allUsers.splice(j, 1);
                                        break;
                                    }
                                }
                            }

                            $scope.selectedAllUsers=$scope.allUsers[0];
                            $scope.selectedCardUsers=$scope.cardUsers[0];

                            document.getElementById("overlayScreen").style.width = "0%";
                            document.getElementById("overlayScreen").style.height = "0%";
                });

                $scope.saveCard = function () {
                    if (isFormValid()) {
                        document.getElementById("overlayScreen").style.width = "100%";
                        document.getElementById("overlayScreen").style.height = "100%";

                        $scope.status = "Saving Card....";

                        if ($scope.cardID != "") {
                            $http.post('services/card/update-card',
                                {
                                    CardId: $scope.cardID,
                                    CardTitle: $scope.cardTitle,
                                    CardDescription: $scope.cardDescription,
                                    GroupId: $scope.groupID,
                                    UserId: $scope.cardUsers[0].ID
                                })
                                .then(function (response) {
                                    document.getElementById("overlayScreen").style.width = "0%";
                                    document.getElementById("overlayScreen").style.height = "0%";

                                    $scope.status = "Card Updated!";
                                    $state.go('inside.group-cards', {groupID:$scope.groupID});
                                });
                        }
                        else {
                            $http.post('services/card/create-card',
                                {
                                    CardTitle: $scope.cardTitle,
                                    CardDescription: $scope.cardDescription,
                                    GroupId: $scope.groupID,
                                    UserId: $scope.cardUsers[0].ID
                                })
                                .then(function (response) {
                                    document.getElementById("overlayScreen").style.width = "0%";
                                    document.getElementById("overlayScreen").style.height = "0%";

                                    $scope.status = "Card Created!";
                                    $state.go('inside.group-cards', {groupID:$scope.groupID});
                                });
                        }

                    }
                };

                $scope.addToGroup = function () {
                    if($scope.cardUsers.length >=1){
                        alert("A card can have only 1 owner. Remove the current owner and add a new owner");
                        return;
                    }

                    $scope.cardUsers.push($scope.selectedAllUsers);
                    $scope.cardUsers.sort(compare);
                    $scope.allUsers.splice($scope.allUsers.indexOf($scope.selectedAllUsers), 1);
                    $scope.selectedAllUsers=$scope.allUsers[0];
                    $scope.selectedCardUsers=$scope.cardUsers[0];
                };

                $scope.removeFromGroup = function () {
                    $scope.allUsers.push($scope.selectedCardUsers[0]);
                    $scope.allUsers.sort(compare);
                    $scope.cardUsers.splice($scope.cardUsers.indexOf($scope.selectedCardUsers[0]), 1);
                    $scope.selectedAllUsers=$scope.allUsers[0];
                    $scope.selectedCardUsers=$scope.cardUsers[0];
                };


                function compare(a, b) {
                    if (a.FirstName < b.FirstName)
                        return -1;
                    if (a.FirstName > b.FirstName)
                        return 1;
                    return 0;
                }

                function isFormValid() {
                    $scope.validation = [];

                    if ($scope.cardUsers.length <= 0) {
                        $scope.validation.push("A card should be assigned an owner.");
                    }

                    if ($scope.cardUsers.length > 1) {
                        $scope.validation.push("A card can have only 1 owner.");
                    }


                    if ($scope.validation.length >= 1) {
                        console.log('form not valid');
                        return false;
                    }

                    return true;
                }

            }]);


}());
