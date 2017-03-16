(function () {
        'use strict';

        var db = require('../models/index');

        var UserModel = db.user;
        var GroupModel = db.group;
        var UserGroupModel = db.user_group;
        var CardModel = db.card;

        var init = function (router) {
            router.get('/get-my-groups', endpoints.getMyGroups);
            router.get('/get-all-groups', endpoints.getAllGroups);
            router.get('/get-group-members', endpoints.getGroupMembers);
            router.get('/get-group-by-id', endpoints.getGroupById);
            router.post('/create-group', endpoints.createGroup);
            router.post('/update-group', endpoints.updateGroup);
            router.post('/delete-group', endpoints.deleteGroup);
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
                var userIds = request.body.UserIds;
                return GroupModel.create({
                    Name: groupName,
                    IsActive: true
                }).then(function (data) {
                    updateGroupUsers(data.ID, userIds);
                    response.send({success: true, group: data});
                });
            },

            deleteGroup: function (request, response) {
                var groupId = request.body.GroupId;
                return GroupModel.destroy({
                    where: {
                        ID: groupId
                    }
                }).then(function (data) {
                    return UserGroupModel.destroy({
                        where: {
                            groupID: groupId
                        }
                    }).then(function(data){
                        return CardModel.destroy({
                            where:{
                                groupID:groupId
                            }
                        }).then(function (data) {
                            response.send({success: true, group: data});
                        });
                    });
                });
            },

            updateGroup: function (request, response) {
                var groupId = request.body.GroupId;
                var groupName = request.body.GroupName;
                var usergroupId = request.body.usergroupId;
                var userIds = request.body.UserIds;
                return GroupModel.update({
                        Name: groupName,
                        IsActive: true
                    },
                    {
                        where: {id: groupId}
                    }).then(function (data) {
                    updateGroupUsers(groupId, userIds);
                    response.send({success: true, group: data});
                });
            }
        };


        function updateGroupUsers(groupId, userIds) {
            UserGroupModel.destroy({
                where: {
                    groupID: groupId
                }
            }).then(function (data) {
                userIds.forEach(function (userId) {
                    UserGroupModel.upsert({
                        userID: userId.ID,
                        groupID: groupId,
                        IsActive: true
                    });
                });
            });
        }

        module.exports = {
            init: init
        };

    }()
);
