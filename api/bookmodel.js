'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserCommentSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	dateCreated: {
		type: Date,
		default: Date.now
	},
	lastUpdatedBy: {
		type: String
	},
	dateUpdated: {
		type: Date,
		default: Date.now
	},
	ratings: {
		substances: { 
			rating: {type: Number, default: 0 },
			comment: { type: String, default: ""}
		},
		sex: { 
			rating: {type: Number, default: 0 },
			comment: { type: String, default: ""}
		},
		violence: { 
			rating: {type: Number, default: 0 },
			comment: { type: String, default: ""}
		},
		language: { 
			rating: {type: Number, default: 0 },
			comment: { type: String, default: ""}
		},
		abuse: { 
			rating: {type: Number, default: 0 },
			comment: { type: String, default: ""}
		},
		hate: { 
			rating: {type: Number, default: 0 },
			comment: { type: String, default: ""}
		},
		immorality: { 
			rating: {type: Number, default: 0 },
			comment: { type: String, default: ""}
		},
		occult: { 
			rating: {type: Number, default: 0 },
			comment: { type: String, default: ""}
		},
	},
	generalComments: {
		type: String,
		default: ""
	}
});

var BookSchema = new Schema({
	title: {
		type: String,
		unique: true,
		require: true,
		trim: true
	},
	dateCreated: {
		type: Date,
		default: Date.now
	},
	dateUpdated: {
		type: Date
	},
	coverURL: {
		type: String
	},
	author: {
		type: String,
		required: true
	},
	publishedYear: {
		type: Number
	},
	pages: {
		type: Number,
	},
	genres: {
		type: String
	},
	averageRatings: {
		substances: { type: Number, default: 0 },
		sex: { type: Number, default: 0 },
		violence: { type: Number, default: 0 },
		language: { type: Number, default: 0 },
		abuse: { type: Number, default: 0 },
		hate: { type: Number, default: 0 },
		immorality: { type: Number, default: 0 },
		occult: { type: Number, default: 0 }
	},
	numberUserReviews: {
		type: Number,
		required: true,
		default: 0
	},
	userReviews: [UserCommentSchema]
});

var Book = mongoose.model('Book', BookSchema);
module.exports = Book;