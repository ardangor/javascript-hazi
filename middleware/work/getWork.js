const requireOption = require("./../requireOption");

module.exports = function (objectRepository) {

    const Work = requireOption(objectRepository, 'Work');

    return function (req, res, next) {
        Work.findOne({ _id: req.params.work_id }, function (err, work) {
            if (err) {
                return next(err);
            }
    
            if (work !== null) {
                res.locals.work = work;
            }
    
            return next();
        });
    }
}