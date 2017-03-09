(function () {
    'use strict';

    angular.module('GroupCardsControllerModule', [])

        .controller('groupCardsController', ['$scope', 'AuthService', '$state', '$http','$stateParams',
            function ($scope, AuthService, $state, $http, $stateParams) {

                $scope.title = "CollabAll - Group Cards";
                $scope.contactAuthor = AuthService.authenticatedUser().FirstName + " " + AuthService.authenticatedUser().LastName;
                $scope.userID = AuthService.authenticatedUser().ID;
                $scope.groupID = $stateParams.groupID;
                $scope.cards = [];


                document.getElementById("overlayScreen").style.width = "100%";
                document.getElementById("overlayScreen").style.height = "100%";

                $http.get('services/card/get-cards-for-group', {params: {GroupId: $scope.groupID}})
                    .then(function (response) {
                        $scope.cards = response.data.cards;

                        document.getElementById("overlayScreen").style.width = "0%";
                        document.getElementById("overlayScreen").style.height = "0%";

                    });


            }]);


}());
