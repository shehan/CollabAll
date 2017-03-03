(function () {
        'use strict';

        var init = function (router) {
            router.post('/send-interjection', endpoints.sendInterjection);
        };

        var endpoints = {

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
