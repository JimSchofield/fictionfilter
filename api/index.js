'use strict';

var express = require('express');
var router = express.Router();

var User = require('./usermodel').User;

var mockData = require('../mockdata.js'); //TEMP


// Profile routes =============

//POST: /users/:name create a new user
router.post('/users', function(req, res, next) {

	if (req.body.username &&
		req.body.email &&
		req.body.password) {

		if(req.body.password !== req.body.passwordConfirm) {
			var err = new Error("passwords don't match...");
			err.status = 400;
			return next(err)
		} else {

		var userData = {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password
		}

		User.create(userData, function(err, user) {
			if(err) { 
				if (err.message.includes("E11000")) {
					err.message = "User already exists!";
				}
				return next(err);
			} else {
				res.redirect('/users/' + user.username);
			}
		});
		}

	} else {
		var err = new Error('All fields required.');
		err.status = 400;
		return next(err);
	}
});

//GET: get list of users //REMOVE ON IMPLEMENT?
router.get('/users', function(req, res, next) {

	console.log("get call for users");
	User.find({})
			.exec(function(err, users) {
				if(err) return next(err);
				res.json(users);
			});
});

//GET: /users/:username get a specific user
router.get('/users/:username', function(req, res, next) {
	var username = req.params.username;
	User.findOne({username: username})
			.exec(function(err, user) {
				if(err) return next(err);
				if(user === null) {
					var err = new Error('User not found!');
					next(err);
				} else {
					res.render('profile', { userData: user });
				}
			});
});


//PUT: /users/:name update profile
router.put('/users/:username', function(req, res) {
	//TODO 
})


//BOOK ROUTES ==================

//SIMPLE GET RESPONSE TEST
router.get('/books/:title', function(req, res, next) {
	// res.json(bookData);
});


module.exports = router;