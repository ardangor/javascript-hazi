const requireOption = require("../requireOption");
var md5 = require('md5');

module.exports = function (objectRepository) {
    return function (req, res, next) {
        if (req.body.password1 !== req.body.password2) {
            res.locals.wrongpassword = null;
            return next();
        }

        console.log(req.body.password1);
        res.locals.user.password = md5(req.body.password1);

        res.locals.user.save(err => {
            if (err) {
                return next(err);
            }

            return res.redirect('/');
        });
    }
}