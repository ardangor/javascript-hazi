const requireOption = require("../requireOption");

module.exports = function (objectRepository) {
    return function (req, res, next) {
        if (typeof res.locals.user === 'undefined') {
            res.locals.wrongemail = null;
            return next();
        }

        return res.redirect(`/forgot-password/new-password/${res.locals.user._id}`);
    }
}