function loggedIn(req, res, next) {
	if (req.session && req.session.userId) {
		return res.redirect('/profile');
	}
	return next();
}

 module.exports.loggedIn = loggedIn;