(function () {
    'use strict';

    angular.module('GroupManageControllerModule', [])

        .controller('groupManageController', ['$scope', 'AuthService', '$state', '$http', '$stateParams',
            function ($scope, AuthService, $state, $http, $stateParams) {

                $scope.title = "CollabAll - Create Group";
                $scope.validation = [];
                $scope.groupID = $stateParams.groupID;
                $scope.groupName = '';

                $scope.allUsers = [];
                $scope.groupUsers = [];

                $scope.selectedAllUsers = [];
                $scope.selectedGroupUsers = [];


                document.getElementById("overlayScreen").style.width = "100%";
                document.getElementById("overlayScreen").style.height = "100%";

                if ($scope.groupID != "") {
                    $http.get('services/group/get-group-by-id', {params: {GroupId: $scope.groupID}})
                        .then(function (response) {
                            $scope.groupName = response.data.group.Name;
                        });
                }

                $http.get('services/user/get-all-active-users')
                    .then(function (response) {
                        $scope.allUsers = response.data.users;
                        $scope.allUsers.sort(compare);

                    }).then(function () {
                    $http.get('services/group/get-group-members', {params: {GroupId: $scope.groupID}})
                        .then(function (response) {
                            $scope.groupUsers = response.data.users;
                            $scope.groupUsers.sort(compare);

                            for (var i = 0; i < $scope.groupUsers.length; i++) {
                                for (var j = 0; j < $scope.allUsers.length; j++) {
                                    if ($scope.groupUsers[i].ID == $scope.allUsers[j].ID) {
                                        $scope.allUsers.splice(j, 1);
                                        break;
                                    }
                                }
                            }

                            document.getElementById("overlayScreen").style.width = "0%";
                            document.getElementById("overlayScreen").style.height = "0%";
                        });
                });

                $scope.saveGroup = function () {
                    if (isFormValid()) {
                        document.getElementById("overlayScreen").style.width = "100%";
                        document.getElementById("overlayScreen").style.height = "100%";

                        $scope.status = "Saving Group....";

                        if ($scope.groupID != "") {
                            $http.post('services/group/update-group',
                                {
                                    GroupId: $scope.groupID,
                                    GroupName: $scope.groupName,
                                    UserIds: $scope.groupUsers
                                })
                                .then(function (response) {
                                    document.getElementById("overlayScreen").style.width = "0%";
                                    document.getElementById("overlayScreen").style.height = "0%";

                                    $scope.status = "Group Updated!";
                                    $state.go('inside.group-my');
                                });
                        }
                        else {
                            $http.post('services/group/create-group',
                                {
                                    GroupName: $scope.groupName,
                                    UserIds: $scope.groupUsers
                                })
                                .then(function (response) {
                                    document.getElementById("overlayScreen").style.width = "0%";
                                    document.getElementById("overlayScreen").style.height = "0%";

                                    $scope.status =  "Group Created!";
                                    $state.go('inside.group-my');
                                });
                        }

                    }
                };

                $scope.addToGroup = function () {
                    for (var i = 0; i < $scope.selectedAllUsers.length; i++) {
                        for (var j = 0; j < $scope.allUsers.length; j++) {
                            if ($scope.selectedAllUsers[i].ID == $scope.allUsers[j].ID) {
                                $scope.groupUsers.push($scope.allUsers[j]);
                                $scope.groupUsers.sort(compare);
                                $scope.allUsers.splice(j, 1);
                                break;
                            }
                        }
                    }
                };

                $scope.removeFromGroup = function () {
                    for (var i = 0; i < $scope.selectedGroupUsers.length; i++) {
                        for (var j = 0; j < $scope.groupUsers.length; j++) {
                            if ($scope.selectedGroupUsers[i].ID == $scope.groupUsers[j].ID) {
                                $scope.allUsers.push($scope.groupUsers[j]);
                                $scope.allUsers.sort(compare);
                                $scope.groupUsers.splice(j, 1);
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

                    if ($scope.groupUsers.length <= 0) {
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
