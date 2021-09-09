const requireOption = require("./../requireOption");

module.exports = function (objectRepository, permissionLevel) {
    return function (req, res, next) {
        if (req.session.user.permission !== permissionLevel) {
            return res.redirect('/');
        }

        return next();
    }
}