const requireOption = require("./../requireOption");

module.exports = function (objectRepository) {
    return function (req, res, next) {

        if (typeof req.session.user === 'undefined') {
            return res.redirect('/');
        }

        res.locals.session_user = req.session.user;
        return next();
    }
}