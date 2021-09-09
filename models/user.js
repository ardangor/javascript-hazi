const mongoose = require('mongoose');

const User = mongoose.model('User', {
    email: String,
    username: String,
    password: String,
    permission: Number
});

module.exports = User;