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
});

//authenticate user against database
UserSchema.statics.auth = function(username, password, callback) {
	User.findOne({ username: username})
		.exec(function(error, user) {
			if (error) {
				return callback(error);
			} else if ( !user ) {
				var err = new Error('User not found...');
				err.status = 401;
				return callback(err);
			}
			bcrypt.compare(password, user.password, function(error, result) {
				if (result === true) {
					return callback(null, user);
				} else {
					return callback();
				}

			});
		});
}

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
module.exports = User;





