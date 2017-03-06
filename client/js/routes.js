(function () {
    'use strict';

    angular.module('CollabAllRoutes', [])

        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
            function( $stateProvider,   $urlRouterProvider,   $locationProvider) {
                $urlRouterProvider.otherwise('/');
                $locationProvider.html5Mode(true);

                //Define States here
                $stateProvider
                    .state('login', {
                        url: '/login',
                        templateUrl: 'templates/login.html',
                        controller: 'loginController'
                    })
                    .state('inside', {
                        abstract: true,
                        templateUrl: 'templates/inside.html',
                        controller: 'insideController'
                    })
                    .state('inside.home', {
                        url: '/', //The url for the state
                        templateUrl: 'templates/home.html', //The path to the html template
                        controller: 'homeController' //The path to the angular controller
                    })
                    .state('inside.group-manage', {
                        url: '/manage-group/:groupID',
                        templateUrl: 'templates/group-manage.html',
                        controller: 'groupManageController'
                    })
                    .state('inside.group-my', {
                        url: '/my-groups',
                        templateUrl: 'templates/group-my.html',
                        controller: 'groupMyController'
                    })
                    .state('signup', {
                        url: '/signup',
                        templateUrl: 'templates/user-create.html',
                        controller: 'userCreateController'
                    });
            }])

        .run(function ($rootScope, $state, AuthService) {
            $rootScope.$on('$stateChangeStart', function (event,next) {
                if (!AuthService.isAuthenticated()) {
                    console.log(next.name);
                    if (next.name !== 'login' && next.name !== 'signup') {
                        event.preventDefault();
                        $state.go('login');
                    }
                } else if(next.data && next.data.permissions){ //check if the state requires permissions
                    if(!next.data.permissions.includes(AuthService.authenticatedUser().Role)) { //If the user doesn't have perms
                        console.log("User does not have permission to access state: " + next.name);
                        event.preventDefault();
                        $state.go('inside.home');
                    }
                }
            });
        });
}());
