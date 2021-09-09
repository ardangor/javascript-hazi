const mongoose = require('mongoose');

const Work = mongoose.model('Work', {
    name: String,
    priority: Number,
    users: [String]
});


module.exports = Work;