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

                $scope.selectedAllUsers = [];
                $scope.selectedCardUsers = [];


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

                $http.get('services/user/get-all-active-users')
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

                            document.getElementById("overlayScreen").style.width = "0%";
                            document.getElementById("overlayScreen").style.height = "0%";
                });

                $scope.saveCard = function () {
                    if (isFormValid()) {
                        document.getElementById("overlayScreen").style.width = "100%";
                        document.getElementById("overlayScreen").style.height = "100%";

                        $scope.status = "Creating Card....";

                        if ($scope.groupID != "") {
                            $http.post('services/group/update-group',
                                {
                                    GroupId: $scope.groupID,
                                    GroupName: $scope.groupName,
                                    UserIds: $scope.cardUsers
                                })
                                .then(function (response) {
                                    document.getElementById("overlayScreen").style.width = "0%";
                                    document.getElementById("overlayScreen").style.height = "0%";

                                    // $state.go('inside.view-papers');
                                });
                        }
                        else {
                            $http.post('services/card/create-card',
                                {
                                    CardTitle: $scope.cardTitle,
                                    CardDescription: $scope.cardDescription,
                                    GroupId: $scope.groupID,
                                    UserId: $scope.cardUsers
                                })
                                .then(function (response) {
                                    document.getElementById("overlayScreen").style.width = "0%";
                                    document.getElementById("overlayScreen").style.height = "0%";

                                    // $state.go('inside.view-papers');
                                });
                        }

                    }
                };

                $scope.addToGroup = function () {
                    for (var i = 0; i < $scope.selectedAllUsers.length; i++) {
                        for (var j = 0; j < $scope.allUsers.length; j++) {
                            if ($scope.selectedAllUsers[i].ID == $scope.allUsers[j].ID) {
                                $scope.cardUsers.push($scope.allUsers[j]);
                                $scope.cardUsers.sort(compare);
                                $scope.allUsers.splice(j, 1);
                                break;
                            }
                        }
                    }
                };

                $scope.removeFromGroup = function () {
                    for (var i = 0; i < $scope.selectedCardUsers.length; i++) {
                        for (var j = 0; j < $scope.cardUsers.length; j++) {
                            if ($scope.selectedCardUsers[i].ID == $scope.cardUsers[j].ID) {
                                $scope.allUsers.push($scope.cardUsers[j]);
                                $scope.allUsers.sort(compare);
                                $scope.cardUsers.splice(j, 1);
                                break;
                            }
                        }
                    }
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
                        $scope.validation.push("There needs to be a minimum of one user assigned to the group");
                    }


                    if ($scope.validation.length >= 1) {
                        console.log('form not valid');
                        return false;
                    }

                    return true;
                }

            }]);


}());
