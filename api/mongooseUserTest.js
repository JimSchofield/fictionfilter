'use strict';

var mongoose = require('mongoose');
var User = require('./usermodel').User;
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/fictionfilter');

var db = mongoose.connection;

db.on("error", function(err) {
	console.error('connection error:', err);
});

db.once("open", function() {
	console.log('Connection successful!');
	//ALL databse communciation goes here

	var testUser = new User({
			username: "Nancy Drew",
			password: "tada",
			email: "yrs@googles.com",
			recentReviews: [],
			favoriteBooks: [],
			readingNow: [],
			favoriteGenres: []
			});

	User.create(testUser, function(err, testUser) {
		if(err) {
			console.log("SAVE FAILED OH NO:", err);
		}
		console.log(testUser)

		db.close(function() {
			console.log("Closing...");
		})
	});

});