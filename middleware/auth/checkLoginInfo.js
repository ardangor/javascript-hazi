const requireOption = require("./../requireOption");
const md5 = require('md5');

module.exports = function (objectRepository) {

    const User = requireOption(objectRepository, 'User');

    return function (req, res, next) {
        res.locals.saved = req.body;

        User.findOne({ email: req.body.email, password: md5(String(req.body.password)) }, function (err, user) {
            if (err) {
                return next(err);
            }

            if (user !== null) {
                res.locals.user = user;
            }

            return next();
        });
    }
}