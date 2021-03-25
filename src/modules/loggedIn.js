function loggedIn(req, res, next) {
	if (req.user) {
		next();
	} else {
		next()
	}
  }

  module.exports = loggedIn