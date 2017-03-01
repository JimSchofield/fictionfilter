'use strict';

var express = require('express');
var app = express();
var routes = require('./routes/routes');
var apiRoutes = require('./api/index');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');

var path = require('path');

var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// use sessions for tracking logins
app.use(session({
	secret: 'hody partner',
	resave: true,
	saveUninitialized: false
}));

// make user ID available to templates
app.use(function(req, res, next){
	res.locals.currentUser = req.session.userId;
	next();
})


// DB
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/fictionfilter');

var db = mongoose.connection;

db.on("error", function(err) {
	console.error('connection error:', err);
});

db.once("open", function() {
	console.log('Connection successful!');
});


//serve up public
app.use(express.static(path.join(__dirname, 'public')));

//set up pug
app.set('view engine', 'pug');


//setup routes
app.use('/', routes);
app.use('/', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error("404 Error: Not found, good sir.");
	err.status = 404;
	next(err);
});

//Error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {title: "Error!", error: err.message})
});


app.listen(port, function() {
	console.log("Started on port", port);
});