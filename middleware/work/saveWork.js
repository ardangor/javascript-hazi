const requireOption = require("./../requireOption");

module.exports = function (objectRepository) {

    const Work = requireOption(objectRepository, 'Work');

    return function (req, res, next) {
        if (typeof req.body.name === 'undefined' ||
            typeof req.body.priority == 'undefined') {
            return next();
        }

        if (typeof res.locals.work === 'undefined') {
            res.locals.work = new Work();
        }

        res.locals.work.name = req.body.name;
        res.locals.work.priority = req.body.priority;

        res.locals.work.save(err => {
            if (err) {
                return next(err);
            }

            return res.redirect('/worklist');
        });
    }
}