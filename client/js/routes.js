(function () {
    'use strict';

    angular.module('CollabAllRoutes', ['ui.router', 'ngAnimate'])

        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
            function( $stateProvider,   $urlRouterProvider,   $locationProvider) {
                $urlRouterProvider.otherwise('/');
                $locationProvider.html5Mode(true);

                //Define States here
                $stateProvider
                    .state('login', {
                        url: '/login',
                        templateUrl: 'templates/login.html',
                        controller: 'loginController',
                        displayName:'Login'
                    })
                    .state('inside', {
                        abstract: true,
                        templateUrl: 'templates/inside.html',
                        controller: 'insideController',
                        displayName:''
                    })
                    .state('inside.home', {
                        url: '/', //The url for the state
                        templateUrl: 'templates/home.html', //The path to the html template
                        controller: 'homeController', //The path to the angular controller
                        displayName:'Home'
                    })
                    .state('inside.my-profile', {
                        url: '/my-profile',
                        templateUrl: 'templates/my-profile.html',
                        controller: 'myProfileController',
                        displayName:'My Profile'
                    })
                    .state('inside.my-password', {
                        url: '/reset-password/:userID',
                        templateUrl: 'templates/my-password.html',
                        controller: 'myPasswordController',
                        displayName:'Reset Password'
                    })
                    .state('inside.group-manage', {
                        url: '/manage-group/:groupID',
                        templateUrl: 'templates/group-manage.html',
                        controller: 'groupManageController',
                        displayName:'Create Group'
                    })
                    .state('inside.group-my', {
                        url: '/my-groups',
                        templateUrl: 'templates/group-my.html',
                        controller: 'groupMyController',
                        displayName:'My Groups'
                    })
                    .state('inside.group-cards', {
                        url: '/group/:groupID/cards',
                        templateUrl: 'templates/group-cards.html',
                        controller: 'groupCardsController',
                        displayName:'Group Cards'
                    })
                    .state('inside.group-card-manage', {
                        url: '/group/:groupID/cards/:cardID',
                        templateUrl: 'templates/card-manage.html',
                        controller: 'cardManageController',
                        displayName:'Group Cards'
                    })
                    .state('inside.group-interjections', {
                        url: '/group/:groupID/interjections',
                        templateUrl: 'templates/group-interjections.html',
                        controller: 'groupInterjectionsController',
                        displayName:'Group Interjections'
                    })
                    .state('inside.group-interjection-manage', {
                        url: '/group/:groupID/interjections/:interjectionID',
                        templateUrl: 'templates/interjection-manage.html',
                        controller: 'interjectionManageController',
                        displayName:'Group Interjections'
                    })
                    .state('inside.group-chat', {
                        url: '/group/:groupID/chat',
                        templateUrl: 'templates/group-chat.html',
                        controller: 'groupChatController',
                        displayName:'Group Chat'
                    })
                    .state('signup', {
                        url: '/signup',
                        templateUrl: 'templates/user-create.html',
                        controller: 'userCreateController',
                        displayName:'Sign Up'
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
