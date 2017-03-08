(function () {
        'use strict';

        var db = require('../models/index');

        var CardModel = db.card;
        var UserModel = db.user;
        var GroupModel = db.group;


        var init = function (router) {
            router.get('/get-cards-for-group', endpoints.getGroupCards);
        };

        var endpoints = {

            getGroupCards: function (request, response) {
                var groupId = request.query.GroupId;
                return CardModel.findAll({
                    where: {
                        groupID: groupId
                    },
                    include: [UserModel, GroupModel]
                }).then(function (data) {
                        response.send({success: true, cards: data});
                    });
            }

        };


        module.exports = {
            init: init
        };

    }()
);
