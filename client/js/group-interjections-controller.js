(function () {
    'use strict';

    angular.module('GroupInterjectionsControllerModule', [])

        .controller('groupInterjectionsController', ['$scope', 'AuthService', '$state', '$http', '$stateParams', '$window',
            function ($scope, AuthService, $state, $http, $stateParams, $window) {

                $scope.title = "CollabAll - Group Interjections";
                $scope.contactAuthor = AuthService.authenticatedUser().FirstName + " " + AuthService.authenticatedUser().LastName;
                $scope.userID = AuthService.authenticatedUser().ID;
                $scope.groupID = $stateParams.groupID;
                $scope.interjections = [];


                document.getElementById("overlayScreen").style.width = "100%";
                document.getElementById("overlayScreen").style.height = "100%";

                $http.get('services/interjection/get-interjections-for-group', {params: {GroupId: $scope.groupID}})
                    .then(function (response) {
                        $scope.interjections = response.data.interjections;

                        document.getElementById("overlayScreen").style.width = "0%";
                        document.getElementById("overlayScreen").style.height = "0%";

                    });

                $scope.deleteInterjection = function (interjection) {
                    var result = $window.confirm("Interjection deletion cannot be reverted. Proceed with deleting this interjection?");
                    if (result !== true) {
                        return;
                    }

                    document.getElementById("overlayScreen").style.width = "100%";
                    document.getElementById("overlayScreen").style.height = "100%";
                    $http.post('services/interjection/delete-interjections-for-group',
                        {
                            GroupInterjectionId: interjection.ID
                        })
                        .then(function (response) {
                            document.getElementById("overlayScreen").style.width = "0%";
                            document.getElementById("overlayScreen").style.height = "0%";

                            $scope.interjections.splice($scope.interjections.indexOf(interjection), 1);
                        });
                };
            }]);
}());
