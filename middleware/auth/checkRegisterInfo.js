const requireOption = require("./../requireOption");

module.exports = function (objectRepository) {

    const User = requireOption(objectRepository, 'User');

    return function (req, res, next) {
        res.locals.saved = req.body;

        if (typeof req.body.email === 'undefined' ||
            typeof req.body.username === 'undefined' ||
            typeof req.body.password1 === 'undefined' ||
            typeof req.body.password2 === 'undefined') {
            return next();
        }

        User.findOne({ email: req.body.email }, function (err, user) {
            if (err) {
                return next(err);
            }

            if (user !== null) {
                res.locals.emailinuse = null;
                return next();
            }

            if (req.body.password1 !== req.body.password2) {
                res.locals.wrongpassword = null;
                return next();
            }

            var newUser = new User();
            newUser.email = req.body.email;
            newUser.username = req.body.username;
            newUser.password = md5(String(req.body.password1));
            newUser.permission = 0;

            newUser.save((err) => {
                if (err) {
                    return next(err);
                }

                return res.redirect('/');
            });
        });
    }
}