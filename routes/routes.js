'use strict';


var express = require('express')
var router = express.Router();
var User = require('../api/usermodel.js');
var mid = require('./middleware');

//TEMP
var mockBookData = require('../mockdata.js');

router.get('/', function(req, res) {
	res.render('index', {title: "Page Title"});
});

router.get('/about', function(req, res) {
	res.render('about', {title: "About"});
});

router.get('/books', function(req, res) {
	res.render('books', {title: "Books", bookData: mockBookData});
});

router.get('/profile', mid.requiresLogin, function(req, res, next) {
	User.findById(req.session.userId)
		.exec(function(error, user) {
			if(error) {
				return next(error);
			} else {
				return res.render('profile', { userData: user });
			}
		});
});

router.get('/register', mid.loggedIn, function(req, res) {
	res.render('register', {title: "Register"});
});

//signin route from login overlay
router.post('/login', mid.loggedIn, function(req, res, next){
	if (req.body.username && req.body.password) {
		User.auth(req.body.username, req.body.password, function(error, user) {
			if (error || !user) {
				var err = new Error("Wrong username or password!");
				err.status = 401;
				return next(err);
			} else {
				req.session.userId = user._id;
				return res.redirect('/users/' + user.username);
			}
		});
	} else {
		var err = new Error('Email and Password are required!');
		err.status = 401;
		return next(err);
	}
});

//lougout
router.get('/logout', function(req, res, next) {
	if (req.session) {
		//delete session!
		req.session.destroy(function(err){
			if (err) return next(err);
			return res.redirect('/');
		});
	}
});

module.exports = router;







