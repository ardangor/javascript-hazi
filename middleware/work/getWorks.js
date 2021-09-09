const requireOption = require("./../requireOption");

module.exports = function (objectRepository) {

    const Work = requireOption(objectRepository, 'Work');

    return function (req, res, next) {
        Work.find({}, function (err, worklist) {
            if (err) {
                return next(err);
            }

            res.locals.worklist = worklist;
            return next();
        });
    }
}