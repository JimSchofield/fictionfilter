'use strict';

var express = require('express');
var router = express.Router();

var User = require('./usermodel').User;

var mockData = require('../mockdata.js');


// Profile routes =============

//POST: /users/:name create a new user
//TODO: incorporate user authent and author
router.post('/users', function(req, res, next) {

	console.log(req.body.username);
	console.log(req.body.email);
	console.log(req.body.password);

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
				return next(err);
			} else {
				res.send("It's a success!")
				console.log(userData);
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
	User.find({username: username})
			.exec(function(err, user) {
				if(err) return next(err);
				res.json(user);
			});
});

//PUT: /users/:name update profile
router.put('/users/:username', function(req, res) {
	//TODO 
})


//BOOK ROUTES ==================

//SIMPLE GET RESPONSE TEST
router.get('/books/:title', function(req, res, next) {
	res.json(mockData);
	console.log("We got a request for title ", req.params.title);
	console.log("It's been returned!")
});


module.exports = router;