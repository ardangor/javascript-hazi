const requireOption = require("./../requireOption");

module.exports = function (objectRepository) {

    const Work = requireOption(objectRepository, 'Work');

    return function (req, res, next) {
        if (typeof res.locals.user === 'undefined') {
            res.locals.user = req.session.user;
        }

        Work.find({ users: res.locals.user.email }, function (err, worklist) {
            if (err) {
                return next(err);
            }

            res.locals.worklist = worklist;
            return next();
        });
    }
}