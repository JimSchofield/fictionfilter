var express = require('express');
var app = express();
var routes = require('./routes/routes');

var port = 3000;

//serve up public
app.use(express.static('public'));

//set up pug
app.set('view engine', 'pug');
app.set('views', __dirname + '/views')

//setup routes
app.use('/', routes);


app.listen(port, function() {
	console.log("Started on port", port);
});