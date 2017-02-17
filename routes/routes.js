var express = require('express')
var router = express.Router();

router.get('/', function(req, res) {
	res.render('index', {title: "Page Title"});
});

router.get('/about', function(req, res) {
	res.render('about', {title: "About"});
});

router.get('/books', function(req, res) {
	res.render('books', {title: "Books"});
});

router.get('/profile', function(req, res) {
	res.render('profile', {title: "My Profile", username: 'Oldcoyote'});
});

router.get('/register', function(req, res) {
	res.render('register', {title: "Register"});
});

router.get('/login', function(req, res){
	res.render('login', {title: "Login"});
});

module.exports = router;