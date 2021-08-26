const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

const md5 = require('md5');

const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const database = 'mongodb://localhost/CLXLCK';

mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true });
const MongoStore = require('connect-mongo');
const session = require('express-session');
app.use(session({
    store: MongoStore.create({ mongoUrl: database }),
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 100
    }
}));

const server = app.listen(3000, function () {
    console.log("On: 3000");
});

const User = mongoose.model('User', {
    email: String,
    password: String,
    permission: Number
});

const Work = mongoose.model('Work', {
    name: String,
    _user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

var checkRegisterInfo = function (req, res, next) {
    if (typeof req.body.email === 'undefined' ||
        typeof req.body.password1 === 'undefined' ||
        typeof req.body.password2 === 'undefined') {
        return next();
    }

    if (req.body.password1 !== req.body.password2) {
        return next();
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            return next(err);
        }

        if (user !== null) {
            return next();
        }

        var newUser = new User();
        newUser.email = req.body.email;
        newUser.password = md5(String(req.body.password1));
        newUser.permission = 0;

        newUser.save((err) => {
            if (err) {
                return next(err);
            }

            return res.redirect('/');
        });
    });
}

var checkLogins = function (req, res, next) {
    User.findOne({ email: req.body.email, password: md5(String(req.body.password)) }, function (err, user) {
        if (err) {
            return next(err);
        }

        res.locals.user = user;
        return next();
    });
}

var sessionHandler = function (req, res, next) {
    if (res.locals.user === null) {
        return next();
    }

    var newUser = {
        email: res.locals.user.email,
        permission: res.locals.user.permission
    };

    req.session.user = newUser;
    return req.session.save(err => res.redirect('/user/worklist'));
}

app.use('/register', checkRegisterInfo,
    (req, res) => {
        res.render('register');
    });

app.use('/user/worklist', (req, res) => {
    res.locals.user = req.session.user;
    res.render('worklist');
});

app.use('/',
    checkLogins,
    sessionHandler, 
    (req, res) => {
        res.render('index');
    });

app.use((err, req, res) => {
    res.end('Problem...');
    console.log(err);
});