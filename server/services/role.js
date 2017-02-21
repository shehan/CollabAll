//http://localhost:8080/services/role/get-all-roles
(function () {
        'use strict';

        var db = require('../models/index');

        var RoleModel = db.role;

        var init = function (router) {
            // router.post('/update-role-by-id', endpoints.updateRoleById);
            router.get('/get-all-roles', endpoints.getAllRoles);
            router.get('/get-role-by-id', endpoints.getRoleById);
            router.post('/insert-role', endpoints.insertRole);
        };

        var endpoints = {

            getAllRoles: function (request, response) {
                return RoleModel.findAll()
                    .then(function (data) {
                        response.send({success: true, roles: data});
                    });
            },

            getRoleById: function (request, response) {
                var roleId = request.query.roleId;
                return RoleModel.findOne({
                    where: {
                        id: roleId
                    }
                }).then(function (data) {
                    response.send({success: true, role: data});
                });
            },

            insertRole: function (request, response) {
                var roleId = request.query.roleId;
                return RoleModel.findOne({
                    where: {
                        id: roleId
                    }
                }).then(function (data) {
                    response.send({success: true, role: data});
                });
            }
        };

        module.exports = {
            init: init
        };

    }()
);
