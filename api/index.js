var express = require('express');
var router = express.Router();


// Profile routes =============

//POST: /users/:name create a new user
//TODO: incorporate user authent and author
router.post('/users', function(req, res) {
	res.json({ response: "Got a post request to create a user with body...", body: req.body })
});

//GET: /users/:name get specific profile
router.get('/users/:username', function(req, res) {
	var username = req.params.username;
	res.render('profile', {title:  username + "'s profile", username: username});
});

//PUT: /users/:name update profile
router.put('/users/:username', function(req, res) {
	var tempObj = {}
    tempObj[req.body.thing] = "updated!"
	res.json(tempObj);
})



module.exports = router;