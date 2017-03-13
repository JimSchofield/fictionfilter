'use strict';

var express = require('express');
var router = express.Router();

var User = require('./usermodel');
var Book = require('./bookmodel');

var mid = require('../routes/middleware');

var helper = require('./helperFunctions');


// SEARCH route ============

router.get('/search', function(req, res, next) {
	res.render('search', { title: "Search"} )
});

//Search specific titles or authors
router.post('/search', function(req, res, next) {
	Book.find({ 
				$or: [
						{ title: { "$regex" : req.body.query, "$options": "i" }},
						{author: { "$regex" : req.body.query, "$options": "i" }}
					]
			})
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

					console.log("date is " + helper.returnFormattedDate(user.registeredAt));


					res.render('profile', { 
						userData: user , 
						title: user.username + "'s Profile", 
						memberSince: helper.returnFormattedDate(user.registeredAt)});
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

//GET Find most recent reviews for a user

router.get('/users/:username/mostrecent', function(req, res, next) {
	var name = req.params.username;
	Book.find({"userReviews.username": name})
		.lean()
	    .sort({'dateUpdated': 'desc'})
		.exec(function(err, results) {
			if (err) return next(err);
			res.render('searchresults.pug',
				{
					query: "10 most recent reviews from " + name,
					title: "10 most recent reviews from " + name,
					results: results
				}
			);
		});
})


//BOOK ROUTES ==================

//GET render book page
router.get('/books/:title', function(req, res, next) {
	var bookTitle = req.params.title;
	var currentUser = req.session.username;
	Book.findOne({title: bookTitle})
			.lean()
			.exec(function(err, book) {
				if(err) return next(err);
				if(book === null) {
					var err = new Error('Book not found!');
					next(err);
				} else {

					var averages = helper.averageUserComments(book.userReviews);

					res.render('books', { 
						bookData: book, 
						title: book.title, 
						lastUpdated: helper.returnFormattedDate(book.dateUpdated),
						currentUser: currentUser,
						"averages": averages
					});
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


// FLAG book as questionable
router.get('/flagbook/:title', mid.requiresLogin, function(req, res, next) {
	var title = req.params.title;

	Book.findOneAndUpdate(
		{ "title": title},
		{ 
			"$set": { 
				"flagged": true 
			}
		},
		function(error, book) {
			if (error) return next(error);
			console.log(book);
			res.redirect('/books/' + escape(title))
		});


})

// BOOK COMMENT ROUTES

// GET add comment page for specific book
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

router.post('/sendcomment/:title', mid.requiresLogin, function(req, res, next) {
	var title = req.params.title,
		rightNow = new Date();

	// format comment into user comment schema
	var comment = {
		username: req.session.username,
		dateCreated: rightNow,
		dateUpdated: rightNow,
		ratings: {
			substances: { 
				rating: req.body.substances,
				comment: req.body.substancesComments
			},
			sex: { 
				rating: req.body.sex,
				comment: req.body.sexComments
			},
			violence: { 
				rating: req.body.violence,
				comment: req.body.violenceComments
			},
			language: { 
				rating: req.body.language,
				comment: req.body.languageComments
			},
			abuse: { 
				rating: req.body.abuse,
				comment: req.body.abuseComments
			},
			hate: { 
				rating: req.body.hate,
				comment: req.body.hateComments
			},
			immorality: { 
				rating: req.body.immorality,
				comment: req.body.immoralityComments
			},
			occult: { 
				rating: req.body.occult,
				comment: req.body.occultComments
			},
		},
		generalComments: req.body.generalComments
	}



	Book.findOne({"title": title, "userReviews.username": req.session.username})
		.lean()
		.exec(function(err, book) {
			if (book) {
				var err = new Error("Comment already created for this book!");
				return next(err)
			} else {
			Book.update( {"title": title },
				{ $push: { userReviews: comment}},
				function(err) {
					if (err) return next(err);

					User.update({ "username": req.session.username },
						{
							$inc: { "reviewsMade": 1},
							$push: {"recentReviews": title}
						}, function () {

							res.redirect('/books/' + escape(title));

						});
					
				});
			}
		});


});

router.post("/deletecomment/:title/:username", mid.requiresLogin, function(req, res, next) {
	var title = req.params.title,
		username = req.params.username;
	Book.update( {"title": title}, { $pull: { userReviews: { "username": username }}}, function(err) {
		if (err) return next(err);

		//remove book from user profile
		User.update(
			{"username": username},
			{
				$pull: { "recentReviews": title}
			}, function() {

				res.redirect('/books/' + escape(title));

			});
	});
});

router.get("/flagcomment/:title/:username", mid.requiresLogin, function(req, res, next) {

	var title = req.params.title;
	var username = req.params.username;

	var setQuery = "userReviews" + username + "flagged"
	var bSetQuery = "book" + setQuery

	//FIND COMMENT AND FLAG
	Book.findOneAndUpdate(
		{ "title": title, "userReviews.username": username},
		{ 
			"$set": { 
				"userReviews.$.flagged": true 
			}
		},
		function(error, book) {
			if (error) return next(error);
			console.log(book);
			res.redirect('/books/' + escape(title))
		});

});






module.exports = router;