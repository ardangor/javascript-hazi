const requireOption = require("./requireOption");

module.exports = function (objectrepository, pageName) {
    return function (req, res) {
        res.render(pageName);
    }
}