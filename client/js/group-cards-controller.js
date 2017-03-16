(function () {
    'use strict';

    angular.module('GroupCardsControllerModule', [])

        .controller('groupCardsController', ['$scope', 'AuthService', '$state', '$http','$stateParams', '$window',
            function ($scope, AuthService, $state, $http, $stateParams, $window) {

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

                $scope.deleteCard = function (card) {
                    var result = $window.confirm("Card deletion cannot be reverted. Proceed with deleting this card?");
                    if(result !== true) {
                        return;
                    }

                    document.getElementById("overlayScreen").style.width = "100%";
                    document.getElementById("overlayScreen").style.height = "100%";
                    $http.post('services/card/delete-card',
                        {
                            CardId: card.ID
                        })
                        .then(function (response) {
                            document.getElementById("overlayScreen").style.width = "0%";
                            document.getElementById("overlayScreen").style.height = "0%";

                            $scope.cards.splice($scope.cards.indexOf(card),1);
                        });
                };


            }]);


}());
