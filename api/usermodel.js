'use strict';


var mongoose = require('mongoose');

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

var User = mongoose.model('User', UserSchema);
module.exports.User = User;