var express = require('express');
var app = express();
var routes = require('./routes/routes');
var apiRoutes = require('./api/index');

var port = 3000;

//serve up public
app.use(express.static('public'));

//set up pug
app.set('view engine', 'pug');
app.set('views', __dirname + '/views')

//setup routes
app.use('/', routes);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error("404 Error: Not found, good sir.");
	err.status = 404;
	next(err);
});

//Error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {title: "Error!", error: err.message})
});


app.listen(port, function() {
	console.log("Started on port", port);
});