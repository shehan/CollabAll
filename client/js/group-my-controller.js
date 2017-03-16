(function () {
    'use strict';

    angular.module('GroupMyControllerModule', [])

        .controller('groupMyController', ['$scope', 'AuthService', '$state', '$http','$window',
            function ($scope, AuthService, $state, $http, $window) {

                $scope.title = "CollabAll - My Group";
                $scope.contactAuthor = AuthService.authenticatedUser().FirstName + " " + AuthService.authenticatedUser().LastName;
                $scope.userID = AuthService.authenticatedUser().ID;
                $scope.myGroups = [];


                document.getElementById("overlayScreen").style.width = "100%";
                document.getElementById("overlayScreen").style.height = "100%";

                $http.get('services/group/get-my-groups', {params: {UserId: $scope.userID}})
                    .then(function (response) {
                        $scope.myGroups = response.data.groups;

                        document.getElementById("overlayScreen").style.width = "0%";
                        document.getElementById("overlayScreen").style.height = "0%";

                    });

                $scope.deleteGroup = function (group) {
                    var result = $window.confirm("Group deletion cannot be reverted. Proceed with deleting this group?");
                    if(result !== true) {
                        return;
                    }

                    document.getElementById("overlayScreen").style.width = "100%";
                    document.getElementById("overlayScreen").style.height = "100%";
                    $http.post('services/group/delete-group',
                        {
                            GroupId: group.group.ID
                        })
                        .then(function (response) {
                            document.getElementById("overlayScreen").style.width = "0%";
                            document.getElementById("overlayScreen").style.height = "0%";

                            $scope.myGroups.splice($scope.myGroups.indexOf(group),1);
                        });
                };


            }]);


}());
