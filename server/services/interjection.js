(function () {
        'use strict';

        var db = require('../models/index');

        var GroupInterjectionModel = db.group_interjection;
        var GroupModel = db.group;


        var init = function (router) {
            router.get('/get-interjections-for-group', endpoints.getGroupInterjections);
            router.get('/get-interjection-by-id-for-group', endpoints.getGroupInterjectionById);
            router.post('/create-interjections-for-group', endpoints.createGroupInterjection);
            router.post('/update-interjections-for-group', endpoints.updateGroupInterjection);
            router.post('/delete-interjections-for-group', endpoints.deleteGroupInterjection);
        //    router.post('/set-default-interjections-for-group', endpoints.setGroupDefaultInterjections);

            router.post('/send-interjection', endpoints.sendInterjection);
        };

        var endpoints = {

            getGroupInterjections: function (request, response) {
                var groupId = request.query.GroupId;
                return GroupInterjectionModel.findAll({
                    where: {
                        groupID: groupId
                    },
                    include: [GroupModel]
                }).then(function (data) {
                    response.send({success: true, interjections: data});
                });
            },

            getGroupInterjectionById: function (request, response) {
                var interjectionId = request.query.GroupInterjectionId;
                return GroupInterjectionModel.findOne({
                    where: {
                        id: interjectionId
                    },
                    include: [GroupModel]
                }).then(function (data) {
                    response.send({success: true, interjection: data});
                });
            },

            createGroupInterjection: function (request, response) {
                var groupId = request.body.GroupId;
                var interjectionTitle = request.body.InterjectionTitle;
                var interjectionDescription = request.body.InterjectionDescription;
                var interjectionIcon = request.body.InterjectionIcon;
                var interjectionColor = request.body.InterjectionColor;
                var interjectionCaptionist = request.body.InterjectionCaptionist;
                var interjectionInterpreter = request.body.InterjectionInterpreter;
                return GroupInterjectionModel.create({
                    Title: interjectionTitle,
                    Description: interjectionDescription,
                    Icon: interjectionIcon,
                    Color: interjectionColor,
                    IncludeCaptionist: interjectionCaptionist,
                    IncludeInterpreter: interjectionInterpreter,
                    groupID: groupId,
                    IsActive: true
                }).then(function (data) {
                    response.send({success: true, interjection: data});
                });
            },

            deleteGroupInterjection: function (request, response) {
                var interjectionId = request.body.GroupInterjectionId;
                return GroupInterjectionModel.destroy({
                    where: {
                        ID: interjectionId
                    }
                }).then(function (data) {
                    response.send({success: true, interjection: data});
                });
            },

            updateGroupInterjection: function (request, response) {
                var interjectionId = request.body.GroupInterjectionId;
                var groupId = request.body.GroupId;
                var interjectionTitle = request.body.InterjectionTitle;
                var interjectionDescription = request.body.InterjectionDescription;
                var interjectionIcon = request.body.InterjectionIcon;
                var interjectionColor = request.body.InterjectionColor;
                var interjectionCaptionist = request.body.InterjectionCaptionist;
                var interjectionInterpreter = request.body.InterjectionInterpreter;
                return GroupInterjectionModel.update({
                    Title: interjectionTitle,
                    Description: interjectionDescription,
                    Icon: interjectionIcon,
                    Color: interjectionColor,
                    IncludeCaptionist: interjectionCaptionist,
                    IncludeInterpreter: interjectionInterpreter,
                    groupID: groupId
                }, {
                    where: {
                        ID: interjectionId
                    }
                }).then(function (data) {
                    response.send({success: true, interjection: data});
                });
            },


            sendInterjection: function (request, response) {
                var groupId = request.body.GroupId;
                var userId = request.body.UserId;
                var interjectionId = request.body.InterjectionId;

               console.log("---------------");
                var io = global.io;
                var socket = global.clients[userId];
                if (socket != undefined){
                    socket.broadcast.in(groupId).emit('interjection',interjectionId);
                    console.log("interjection sent");
                }
                else
                {
                    console.log("socket undefined");
                }
            }

        };

        module.exports = {
            init: init
        };

    }()
);
