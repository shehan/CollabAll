(function () {
        'use strict';

        var db = require('../models/index');

        var CardModel = db.card;
        var UserModel = db.user;
        var GroupModel = db.group;


        var init = function (router) {
            router.get('/get-cards-for-group', endpoints.getGroupCards);
            router.get('/get-card-by-id', endpoints.getCardById);
            router.post('/create-card', endpoints.createCard);
            router.post('/update-card', endpoints.updateCard);
            router.post('/delete-card', endpoints.deleteCard);
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
            },

            getCardById: function (request, response) {
                var cardId = request.query.CardId;
                return CardModel.findOne({
                    where: {
                        id: cardId
                    },
                    include: [UserModel, GroupModel]
                }).then(function (data) {
                    response.send({success: true, card: data});
                });
            },

            createCard: function (request, response) {
                var groupId = request.body.GroupId;
                var cardTitle = request.body.CardTitle;
                var cardDescription = request.body.CardDescription;
                var userId = request.body.UserId;
                return CardModel.create({
                    Title: cardTitle,
                    Description: cardDescription,
                    userID: userId,
                    groupID: groupId,
                    IsActive: true
                }).then(function (data) {
                    response.send({success: true, card: data});
                });
            },

            deleteCard: function (request, response) {
                var cardId = request.body.CardId;
                return CardModel.destroy({
                    where: {
                        ID: cardId
                    }
                }).then(function (data) {
                    response.send({success: true, card: data});
                });
            },

            updateCard: function (request, response) {
                var cardId = request.body.CardId;
                var groupId = request.body.GroupId;
                var cardTitle = request.body.CardTitle;
                var cardDescription = request.body.CardDescription;
                var userId = request.body.UserId;
                return CardModel.update({
                    Title: cardTitle,
                    Description: cardDescription,
                    userID: userId
                }, {
                    where: {
                        ID: cardId
                    }
                }).then(function (data) {
                    response.send({success: true, card: data});
                });
            }
        };


        module.exports = {
            init: init
        };

    }()
);
