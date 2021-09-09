const requireOption = require("./../requireOption");

module.exports = function (objectRepository) {
    return function (req, res, next) {
        if (typeof res.locals.user === 'undefined') {
            res.locals.wrongpassword = null;
            return next();
        }
    
        var newUser = {
            email: res.locals.user.email,
            username: res.locals.user.username,
            permission: res.locals.user.permission
        };
    
        req.session.user = newUser;
    
        return req.session.save(function (err) {
            if (err) {
                return next(err);
            }
    
            res.redirect('/worklist');
        });
    }
}