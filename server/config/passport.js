(function () {
    'use strict';
    var JwtStrategy = require('passport-jwt').Strategy;
    var ExtractJwt = require('passport-jwt').ExtractJwt;

    // load up the user model
    var db = require('../models/index');
    var User = db.user;
    var salt = require(__dirname + '/salt'); // get  salt file

    module.exports = function (passport) {
        var opts = {};
        opts.secretOrKey = salt.secret;
        opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
        passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
            User.findOne({id: jwt_payload.id}, function (err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        }));
    };
}());
