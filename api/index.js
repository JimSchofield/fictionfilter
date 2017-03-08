'use strict';

var express = require('express');
var router = express.Router();

var User = require('./usermodel');
var Book = require('./bookmodel');

var mid = require('../routes/middleware');

var mockData = require('../mockdata.js'); //TEMP

// RETURN FORMATTED DATE
function returnFormattedDate(mongooseDate) {
	var date = new Date(mongooseDate);
	var d = date.getDate();
	var m = date.getMonth()+1;
	var y = date.getFullYear();
	var monthNames = ["January", "February", "March", "April", "May", "June",
		  "July", "August", "September", "October", "November", "December"
	];
	return monthNames[m] + " " + d + ", " + y;
}

// SEARCH route ============

//Search specific titles
router.post('/search', function(req, res, next) {
	Book.find({ title: { "$regex" : req.body.query, "$options": "i" }})
		.limit(10)
		.lean()
		.exec(function(error, results) {
			if (error) return next(error);

			if (results.length == 0) {
				var err = new Error("No books found!");
				return next(err);
			}

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
	Book.find({})
		.limit(10)
	    .sort({'dateUpdated': 'desc'})
		.lean()
		.exec(function(error, results) {
			if (error) return next(error);
			res.render('searchresults.pug',
				{
					query: "10 most recent",
					title: "10 most recent",
					results: results
				}
			);
		});
});

//Search by Author ??



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
				return res.redirect('/profile');
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
					return next(err);
				} else {

					console.log("date is " + returnFormattedDate(user.registeredAt));


					res.render('profile', { 
						userData: user , 
						title: user.username + "'s Profile", 
						memberSince: returnFormattedDate(user.registeredAt)});
				}
			});
});


//PUT using post from a form update profile
router.post('/users/update/:username', mid.requiresLogin, function(req, res, next) {
	var name = req.params.username;
	User.update( { "username": name }, { $set: req.body }, function(err) {
		if (err) return next(err);
		res.redirect("/profile");
	});
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

					res.render('books', { bookData: book, title: book.title, lastUpdated: returnFormattedDate(book.dateUpdated) });
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
					err.status = 500;
					next(err);
				} else {
					res.send(book);
				}
			});
});

//POST book to database
router.post('/books', function(req, res, next) {

	req.body.lastUpdatedBy = req.session.username;

	Book.create(req.body , function(err, user) {
		if(err) { 
			if (err) return next(err);
		} else {
			res.redirect('/books/' + escape(req.body.title));
		}
	});
});

// Get edit book page
router.get('/edit/:title', mid.requiresLogin, function(req, res, next) {
	var bookTitle = req.params.title;

	Book.findOne({title: bookTitle})
			.lean()
			.exec(function(err, book) {
				if(err) return next(err);
				if(book === null) {
					var err = new Error('Book not found!');
					err.status = 500;
					next(err);
				} else {



					res.render('editbook', { bookData: book, title: "Editing: " + book.title });
				}
			});
});

// POST update book content
router.post('/books/edit/:title', mid.requiresLogin, function(req, res, next) {
	var title = req.params.title;
	var formUpdates = req.body;

	var currentDate = new Date();

	var bookUpdates = {
		"title": title,
		"author": formUpdates.author,
		"coverURL" : formUpdates.coverURL,
		"publishedYear" : formUpdates.publishedYear,
		"pages" : formUpdates.pages,
		"genres" : formUpdates.genres,
		"dateUpdated": currentDate,
		"lastUpdatedBy": req.session.username,
	}

	Book.update( { "title": title },
					{ $set: bookUpdates},
					function(err) {
		if (err) return next(err);
		res.redirect("/books/" + escape(title));
	});
});

// BOOK COMMENT ROUTES

// GET add comment for specific book
router.get('/addcomment/:title', mid.requiresLogin, function(req, res, next) {
	var bookTitle = req.params.title;

	Book.findOne({title: bookTitle})
			.lean()
			.exec(function(err, book) {
				res.render('addcomment', { 
					title: "Adding a comment",
					bookData: book
				});
			});
});




module.exports = router;
module.exports.returnFormattedDate = returnFormattedDate;