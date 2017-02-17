var express = require('express');
var app = express();

var port = 7777;

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/views')

app.get('/', function(req, res) {
	res.render('index', {title: "Page Title"});
});

app.get('/about', function(req, res) {
	res.render('about', {title: "About"});
});

app.get('/books', function(req, res) {
	res.render('books', {title: "Books"});
});

app.get('/profile', function(req, res) {
	res.render('profile', {title: "My Profile", username: 'Oldcoyote'});
});

app.get('/register', function(req, res) {
	res.render('register', {title: "Register"});
});

app.get('/login', function(req, res){
	res.render('login', {title: "Login"});
});

app.listen(port, function() {
	console.log("Started on port", port);
});