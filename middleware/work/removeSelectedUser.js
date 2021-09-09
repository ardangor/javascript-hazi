const requireOption = require("./../requireOption");

module.exports = function (objectRepository) {
    return function (req, res, next) {
        res.locals.work.users.remove(res.locals.user.email);

        res.locals.work.save(err => {
            if (err) {
                return next(err);
            }
    
            return res.redirect(`/worklist/edit-work/${res.locals.work._id}`);
        });
    }
}