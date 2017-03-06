(function () {
        'use strict';

        var db = require('../models/index');

        var UserModel = db.user;
        var GroupModel = db.group;
        var UserGroupModel = db.user_group;

        var init = function (router) {
            // router.post('/update-role-by-id', endpoints.updateRoleById);
            router.get('/get-my-groups', endpoints.getMyGroups);
            router.get('/get-all-groups', endpoints.getAllGroups);
            router.get('/get-group-members', endpoints.getGroupMembers);
            router.get('/get-group-by-id', endpoints.getGroupById);
            router.post('/create-group', endpoints.createGroup);
            router.post('/add-user', endpoints.addUser);
            //  router.post('/remove-user', endpoints.removeUser);
        };

        var endpoints = {

            getAllGroups: function (request, response) {
                return GroupModel.findAll()
                    .then(function (data) {
                        response.send({success: true, groups: data});
                    });
            },

            getMyGroups: function (request, response) {
                var userId = request.query.UserId;
                return UserGroupModel.findAll({
                    where: {
                        userID: userId
                    },
                    include: [GroupModel]
                }).then(function (data) {
                        response.send({success: true, groups: data});
                    });
            },

            getGroupMembers: function (request, response) {
                var groupId = request.query.GroupId;
                return UserGroupModel.findAll({
                    where: {
                        groupID: groupId
                    },
                    include: [UserModel, GroupModel]
                }).then(function (data) {
                    var userList = [];
                    for (var i = 0; i < data.length; i++) {
                        userList.push(data[i].user)
                    }
                    response.send({success: true, users: userList});
                });
            },

            getGroupById: function (request, response) {
                var groupId = request.query.GroupId;
                return GroupModel.findOne({
                    where: {
                        id: groupId
                    }
                }).then(function (data) {
                    response.send({success: true, group: data});
                });
            },

            createGroup: function (request, response) {
                var groupName = request.body.GroupName;
                return GroupModel.create({
                    Name: groupName,
                    IsActive: true
                }).then(function (data) {
                    response.send({success: true, group: data});
                });
            },

            addUser: function (request, response) {
                var groupId = request.body.GroupId;
                var userIds = request.body.UserIds;
                var usergroupId = request.body.usergroupId;

                UserGroupModel.destroy({
                    where: {
                        groupID: groupId,
                    }
                }).then(function (data) {
                    userIds.forEach(function (userId) {
                        UserGroupModel.upsert({
                            ID: usergroupId,
                            userID: userId.ID,
                            groupID: groupId,
                            IsActive: true
                        });
                    });
                });

                response.send({success: true});
            }
        };

        module.exports = {
            init: init
        };

    }()
);
