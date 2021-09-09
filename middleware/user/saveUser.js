const requireOption = require("./../requireOption");

module.exports = function (objectRepository) {

    const User = requireOption(objectRepository, 'User');

    return function (req, res, next) {
        if (typeof req.body.email === 'undefined' ||
            typeof req.body.username === 'undefined' ||
            typeof req.body.permission === 'undefined') {
            return next();
        }

        if (typeof res.locals.user === 'undefined') {
            res.locals.user = new User();
        }

        res.locals.user.email = req.body.email;
        res.locals.user.username = req.body.username;
        res.locals.user.permission = req.body.permission;

        res.locals.user.save(err => {
            if (err) {
                return next(err);
            }

            return res.redirect('/users');
        });
    }
}