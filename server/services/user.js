//http://localhost:8080/services/user/get-all-users
(function () {
    'use strict';

        var db = require('../models/index');
        var config = require('../config/salt.js');
        var jwt = require('jwt-simple');


        var UserModel = db.user;

        var init = function (router) {
            // router.post('/update-role-by-id', endpoints.updateRoleById);
            router.get('/get-all-users', endpoints.getAllUsers);
            router.get('/get-all-active-users', endpoints.getAllActiveUsers);
            router.get('/get-user-by-id/:userId', endpoints.getUserById);
            router.get('/get-user-by-email/:userEmail', endpoints.getUserByEmail);
            router.post('/create', endpoints.create);
            router.post('/authenticate', endpoints.authenticate);
        };

        var endpoints = {

            getAllActiveUsers: function (request, response) {
                return UserModel.findAll({
                    where: {
                        IsActive: true
                    },
                    attributes: {
                        exclude: ['Password']
                    }
                })
                    .then(function (data) {
                        response.send({success: true, users: data});
                    });
            },

            getAllUsers: function (request, response) {
                return UserModel.findAll({
                    attributes: {
                        exclude: ['Password']
                    }
                })
                    .then(function (data) {
                        response.send({success: true, users: data});
                    });
            },

            getUserById: function (request, response) {
                var userId = request.params.userId;
                return UserModel.findOne({
                    where: {
                        id: userId
                    },
                    attributes: {
                        exclude: ['Password']
                    }
                }).then(function (data) {
                    response.send({success: true, user: data});
                });
            },

            getUserByEmail: function (request, response) {
                var userEmail = request.params.userEmail;
                return UserModel.findOne({
                    where: {
                        Email: userEmail
                    },
                    attributes: {
                        exclude: ['Password']
                    }
                }).then(function (data) {
                    response.send({success: true, user: data});
                });
            },

            create: function (request, response) {

                var firstName = request.body.firstName;
                var lastName = request.body.lastName;
                var email = request.body.email;
                var password = UserModel.hashPassword(request.body.password);
                var roleId = 1;

                console.log(firstName);
                return UserModel.create({
                        FirstName: firstName,
                        LastName: lastName,
                        Email: email,
                        Password: password,
                        IsActive: true,
                        roleID: roleId
                }).then(function (data) {
                    data.Password = "";
                    response.send({success: true, user: data});
                }).catch(function(error){
                    var msg = 'The email address is already registered';
                    response.send({success: false, msg: msg});
                    console.log(error);
                });
            },

            authenticate: function(request, res) {
                var email = request.body.email;
                var password = request.body.password;

                UserModel.findOne({
                    where: {
                        Email: email
                    }
                }).then(function(user) {

                    if(!user){
                        var msg = 'Authentication failed. User not found.';
                        console.log(msg);
                        return res.send({success: false, msg: msg});
                    }

                    // check if password matches
                    user.comparePassword(password, function (err, isMatch) {
                        if (isMatch && !err) {
                            // if user is found and password is right create a token
                            var token = jwt.encode(user, config.secret);
                            user.Password = "";
                            // return the information including token as JSON
                            res.json({success: true, token: 'JWT ' + token, user: user});
                        } else {
                            res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                        }
                    });
                }).catch(function(error){
                    console.log('uh oh' + error);
                });
            }
        };



        module.exports = {
            init: init
        };

    }()
);
