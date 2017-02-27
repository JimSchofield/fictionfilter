'use strict';


var express = require('express')
var router = express.Router();

//TEMP
var mockBookData = require('../mockdata.js');

router.get('/', function(req, res) {
	res.render('index', {title: "Page Title"});
});

router.get('/about', function(req, res) {
	res.render('about', {title: "About"});
});

router.get('/books', function(req, res) {
	res.render('books', {title: "Books", bookData: mockBookData});
});

router.get('/profile', function(req, res) {
	res.render('profile', {title: "My Profile", username: 'Oldcoyote'});
});

router.get('/register', function(req, res) {
	res.render('register', {title: "Register"});
});

//signin route from login overlay
router.post('/login', function(req, res){
	return res.send('Logged In!');
});

module.exports = router;