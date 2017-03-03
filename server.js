// server.js

// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var http = require('http').Server(app);
var io  = require('socket.io')(http);
// configuration ===========================================
global.io = io;

// set our port
var port = process.env.PORT || 8080;


// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /client/img will be /img for users
app.use(express.static(__dirname + '/client'));

// routes ==================================================
//require('./app/routes')(app); // configure our routes


// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/client'));

// Use the passport package in our application
require(__dirname + '/server/config/passport')(passport);
app.use(passport.initialize());


//Set up the api endpoints
require(__dirname + '/server/services/index').init(express, app);

// --- Sequelize ---
require(__dirname + '/server/models/index');

app.get('*', function(req, res) {
    res.sendfile(__dirname + '/client/index.html');
});


global.clients = {};
io.on('connection', function(socket){
    console.log('socket: a user connected ->'+socket.handshake.query.userid);


    clients[socket.handshake.query.userid] = socket;

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

// start app ===============================================
// startup our app at http://localhost:8080
http.listen(port);

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = http;