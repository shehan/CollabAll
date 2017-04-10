(function () {
    'use strict';

    angular.module('InterjectionManageControllerModule', ['colorpicker.module','ui-iconpicker'])

        .controller('interjectionManageController', ['$scope', 'AuthService', '$state', '$http', '$stateParams',
            function ($scope, AuthService, $state, $http, $stateParams) {

                $scope.title = "CollabAll - Create Interjection";
                $scope.validation = [];
                $scope.groupID = $stateParams.groupID;
                $scope.interjectionID = $stateParams.interjectionID;
                $scope.interjectionTitle = '';
                $scope.interjectionDescription = '';
                $scope.interjectionIcon = '';
                $scope.interjectionColor = '';
                $scope.interjectionCaptionist = false;
                $scope.interjectionInterpreter = true;
                $scope.nonInput = [];


                document.getElementById("overlayScreen").style.width = "100%";
                document.getElementById("overlayScreen").style.height = "100%";

                if ($scope.interjectionID != "") {
                    $http.get('services/interjection/get-interjection-by-id-for-group', {params: {GroupInterjectionId: $scope.interjectionID}})
                        .then(function (response) {
                            $scope.interjectionTitle = response.data.interjection.Title;
                            $scope.interjectionDescription = response.data.interjection.Description;
                            $scope.interjectionIcon = response.data.interjection.Icon;
                            $scope.nonInput.interjectionBackgroundColor = response.data.interjection.BackgroundColor;
                            $scope.nonInput.interjectioTextColor = response.data.interjection.TextColor;
                            $scope.interjectionCaptionist = response.data.interjection.IncludeCaptionist;
                            $scope.interjectionInterpreter = response.data.interjection.IncludeInterpreter;
                        });
                }

                document.getElementById("overlayScreen").style.width = "0%";
                document.getElementById("overlayScreen").style.height = "0%";


                $scope.saveInterjection = function () {
                    document.getElementById("overlayScreen").style.width = "100%";
                    document.getElementById("overlayScreen").style.height = "100%";

                    $scope.status = "Saving Interjection....";

                    if ($scope.interjectionID != "") {
                        $http.post('services/interjection/update-interjections-for-group',
                            {
                                InterjectionTitle: $scope.interjectionTitle,
                                InterjectionDescription: $scope.interjectionDescription,
                                InterjectionIcon: $scope.interjectionIcon,
                                InterjectionBackgroundColor: $scope.nonInput.interjectionBackgroundColor,
                                InterjectionTextColor: $scope.nonInput.interjectioTextColor,
                                InterjectionCaptionist: $scope.interjectionCaptionist,
                                InterjectionInterpreter: $scope.interjectionInterpreter,
                                GroupId: $scope.groupID,
                                GroupInterjectionId: $scope.interjectionID
                            })
                            .then(function (response) {
                                document.getElementById("overlayScreen").style.width = "0%";
                                document.getElementById("overlayScreen").style.height = "0%";

                                $scope.status = "Interjection Updated!";
                                $state.go('inside.group-interjections', {groupID: $scope.groupID});
                            });
                    }
                    else {
                        $http.post('services/interjection/create-interjections-for-group',
                            {
                                InterjectionTitle: $scope.interjectionTitle,
                                InterjectionDescription: $scope.interjectionDescription,
                                InterjectionIcon: $scope.interjectionIcon,
                                InterjectionBackgroundColor: $scope.nonInput.interjectionBackgroundColor,
                                InterjectionTextColor: $scope.nonInput.interjectioTextColor,
                                InterjectionCaptionist: $scope.interjectionCaptionist,
                                InterjectionInterpreter: $scope.interjectionInterpreter,
                                GroupId: $scope.groupID
                            })
                            .then(function (response) {
                                document.getElementById("overlayScreen").style.width = "0%";
                                document.getElementById("overlayScreen").style.height = "0%";

                                $scope.status = "Interjection Created!";
                                $state.go('inside.group-interjections', {groupID: $scope.groupID});
                            });
                    }
                };
            }]);


}());
