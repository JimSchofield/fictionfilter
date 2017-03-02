'use strict';

var express = require('express');
var router = express.Router();

var User = require('./usermodel');
var Book = require('./bookmodel');

var mockData = require('../mockdata.js'); //TEMP

// SEARCH route ============

//Search specific titles
router.post('/search', function(req, res, next) {
	Book.find({ title: { "$regex" : req.body.query, "$options": "i" }})
		.limit(10)
		.lean()
		.exec(function(error, results) {
			if (error) return next(error);

			res.render('searchresults.pug',
				{
					query: req.body.query,
					title: "Search results for: " + req.body.query,
					results: results
				}
			);
		});
});

//Search latest modified
router.get('/searchlatest', function(req, res, next) {
	Book.find({}, {}, { sort: { 'dateModified' : -1 } })
		.limit(10)
		.lean()
		.exec(function(error, results) {
			if (error) return next(error);
			res.render('searchresults.pug',
				{
					query: req.body.query,
					title: "Search results for: " + req.body.query,
					results: results
				}
			);
		});
});

//Search by Author



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
				req.session.userId = user._id;
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
			.lean()
			.exec(function(err, user) {
				if(err) return next(err);
				if(user === null) {
					var err = new Error('User not found!');
					next(err);
				} else {
					res.render('profile', { userData: user , title: user.username + "'s Profile"});
				}
			});
});


//PUT: /users/:name update profile
router.put('/users/:username', function(req, res) {
	//TODO 
})


//BOOK ROUTES ==================

//GET render book page
router.get('/books/:title', function(req, res, next) {
	var bookTitle = req.params.title;
	Book.findOne({title: bookTitle})
			.lean()
			.exec(function(err, book) {
				if(err) return next(err);
				if(book === null) {
					var err = new Error('Book not found!');
					next(err);
				} else {
					res.render('books', { bookData: book, title: book.title });
				}
			});
});

// GET book json
router.get('/booksjson/:title', function(req, res, next) {
	var bookTitle = req.params.title;
	Book.findOne({title: bookTitle})
			.exec(function(err, book) {
				if(err) return next(err);
				if(book === null) {
					var err = new Error('Book not found!');
					next(err);
				} else {
					res.send(book);
				}
			});
});

//POST book to database
router.post('/books', function(req, res, next) {
	Book.create(req.body , function(err, user) {
		if(err) { 
			if (err) return next(err);
		} else {
			res.redirect('/books/' + escape(req.body.title));
		}
	});
});




module.exports = router;