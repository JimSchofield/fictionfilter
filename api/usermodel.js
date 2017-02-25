'use strict';


var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		trim: true
	},
	registeredAt: {
		type: Date,
		default: Date.now
	},
	reviewsMade: {
		type: Number,
		default: 0,
		required: true
	},
	recentReviews: {
		type: [],
		default: [],
	},
	favoriteBooks: {
		type: String,
		default: "",
	},
	readingNow: {
		type: String,
		default: "",
	},
	favoriteGenres: {
		type: String,
		default: "",
	}
})

//hash password before saving
UserSchema.pre('save', function(next) {
	var user = this;
	bcrypt.hash(user.password, 10, function( err, hash) {
		if(err) return next(err);
		user.password = hash;
		next();
	});
});

var User = mongoose.model('User', UserSchema);
module.exports.User = User





