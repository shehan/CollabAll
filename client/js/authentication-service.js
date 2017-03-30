(function () {
    'use strict';

    angular.module('AuthModule', [])

        .service('AuthService', function($q, $http) {
            var LOCAL_TOKEN_KEY = 'yourTokenKey';
            var AUTH_USER = 'authUser';
            var AVATAR_USER = 'avatarUser';
            var isAuthenticated = false;
            var authToken;
            var authUser;

            function loadUserCredentials() {
                var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                var user = JSON.parse(window.localStorage.getItem(AUTH_USER));
                var avatar = window.localStorage.getItem(AVATAR_USER);
                if (token && user) {
                    useCredentials(token, user, avatar);
                }
            }

            function storeUserCredentials(token,user, avatar) {
                window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
                window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
                window.localStorage.setItem(AVATAR_USER, avatar);
                useCredentials(token, user, avatar);
            }


            function useCredentials(token, user, avatar) {
                isAuthenticated = true;
                authToken = token;
                authUser = user;
                authUser.Avatar = avatar;

                // Set the token as header for your requests!
                $http.defaults.headers.common.Authorization = authToken;
            }

            function destroyUserCredentials() {
                authToken = undefined;
                isAuthenticated = false;
                authUser = undefined;
                $http.defaults.headers.common.Authorization = undefined;
                window.localStorage.removeItem(LOCAL_TOKEN_KEY);
                window.localStorage.removeItem(AUTH_USER);
                window.localStorage.removeItem(AVATAR_USER);
            }

            var update = function (user) {
                return $q(function(resolve, reject) {
                    $http.post('services/user/update', user).then(function(result) {
                        if (result.data.success) {
                            storeUserCredentials(authToken,result.data.user,user.avatar);
                            resolve(result.data.msg);
                        } else {
                            reject(result.data.msg);
                        }
                    });
                });
            };

            var passwordReset = function (user) {
                return $q(function(resolve, reject) {
                    $http.post('services/user/update-password', user).then(function(result) {
                        if (result.data.success) {
                            destroyUserCredentials();
                            resolve(result.data.msg);
                        } else {
                            reject(result.data.msg);
                        }
                    });
                });
            };

            var register = function(user) {
                return $q(function(resolve, reject) {
                    $http.post('services/user/create', user).then(function(result) {
                        if (result.data.success) {
                            resolve(result.data.msg);
                        } else {
                            reject(result.data.msg);
                        }
                    });
                });
            };

            var login = function(user) {
                return $q(function(resolve, reject) {
                    $http.post('services/user/authenticate', user).then(function(result) {
                        if (result.data.success) {

                            var avatar="";
                            if(result.data.avatar != null)
                                avatar = result.data.avatar.Avatar;

                            storeUserCredentials(result.data.token,result.data.user,avatar);
                            resolve(result.data.msg);
                        } else {
                            reject(result.data.msg);
                        }
                    });
                });
            };


            var logout = function() {
                destroyUserCredentials();
            };

            loadUserCredentials();

            return {
                login: login,
                register: register,
                logout: logout,
                update: update,
                passwordReset: passwordReset,
                authenticatedUser: function () {return authUser;},
                isAuthenticated: function() {return isAuthenticated;}
            };
        })

        .factory('AuthInterceptor', function ($rootScope, $q) {
            return {
                responseError: function (response) {
                    $rootScope.$broadcast({
                        401: 'Not Authenticated',
                    }[response.status], response);
                    return $q.reject(response);
                }
            };
        })

        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('AuthInterceptor');
        });
}());
