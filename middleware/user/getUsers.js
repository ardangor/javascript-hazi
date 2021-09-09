const requireOption = require("./../requireOption");

module.exports = function (objectRepository) {

    const User = requireOption(objectRepository, 'User');

    return function (req, res, next) {
        User.find({}, function (err, users) {
            if (err) {
                return next(err);
            }

            res.locals.users = users;
            return next();
        });
    }
}