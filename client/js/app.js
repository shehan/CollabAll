(function () {
    'use strict';

    angular.module('CollabAll', [
        'ui.router',

        'CollabAllRoutes',
        'AuthModule',

        'FileReadDirective',
        'LoginControllerModule',
        'InsideControllerModule',
        'HomeControllerModule',
        'UserCreateControllerModule',
        'GroupManageControllerModule',
        'GroupMyControllerModule'
    ]);
}());
