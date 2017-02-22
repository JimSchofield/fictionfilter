'use strict';

var express = require('express');
var router = express.Router();

var User = require('./usermodel').User;


// Profile routes =============

//POST: /users/:name create a new user
//TODO: incorporate user authent and author
router.post('/users', function(req, res) {
	
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



module.exports = router;