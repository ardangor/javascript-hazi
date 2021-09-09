const requireOption = require("./../requireOption");

module.exports = function (objectRepository) {

    const User = requireOption(objectRepository, 'User');
    
    return function (req, res, next) {
        User.findOne({ _id: req.params.user_id }, function (err, user) {
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