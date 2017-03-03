(function () {
    'use strict';

    angular.module('InsideControllerModule', ['AuthModule'])

        .controller('insideController', ['$scope', '$state', '$http', 'AuthService', function ($scope, $state, $http, AuthService) {
            $scope.contactAuthor = AuthService.authenticatedUser().FirstName + " " + AuthService.authenticatedUser().LastName;
            $scope.userID = AuthService.authenticatedUser().ID;


            var user = 'userid=' + $scope.userID;
            var socket = io.connect({query: $scope.userID});

            socket.on('connect', function(msg){
                socket.emit('join',user);
                console.log("client joining server");
            });

            socket.emit("subscribe", { group: "1" });

       //     socket.emit("unsubscribe", { group: "1" });

            socket.on("disconnect", function(){
                console.log("client disconnected from server");
            });

            socket.on('notification message', function (msg) {
                alert(msg);
                $scope.hasNotifications = true;
                $scope.$apply();
            });
            console.log(socket);


            $scope.title = "CollabAll";

            $scope.logout = function () {
                socket.disconnect();
                AuthService.logout();
                $state.go('login');
            };

            if (AuthService.authenticatedUser() !== undefined) {
                $scope.welcomeMessage = "Welcome " + AuthService.authenticatedUser().FirstName + " " + AuthService.authenticatedUser().LastName;
            }

            $scope.isCurrentState = function (stateName) {
                return $state.current.name === stateName;
            };

            //Set up the sidebar links
            var states = $state.get(); //get all the states
            //Links is the list of links the user will see
            $scope.links = [];

            states.forEach(function (state) {
                var name = state.name.split('.');

                //Check if state is an inside state
                if (name.length <= 1 || name[0] !== 'inside') {
                    return;
                }

                //Check if state requires query number
                if (state.url.includes(':')) {
                    return;
                }

                //Check if user has permissions
                if (state.data && state.data.permissions && !state.data.permissions.includes(AuthService.authenticatedUser().Role)) {

                    //If user does NOT have permissions, don't add link
                    return;
                }


                //If we get here, the state is something we want to add. Now we just need to make the name pretty

                name = name[1]; //Get the second half of the name
                name = name.replace(new RegExp('-', 'g'), ' '); //Replace - with a space
                //name = name.charAt(0).toUpperCase() + name.slice(1); //Uppercase first letter
                name = toTitleCase(name);

                //Finally, we add to our list
                $scope.links.push({
                    name: name,
                    stateName: state.name
                });
            });
        }]);

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}());
