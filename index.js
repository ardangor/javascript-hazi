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
        maxAge: 24 * 60 * 60 * 1000
    }
}));

const server = app.listen(3000, function () {
    console.log("On: 3000");
});

const User = mongoose.model('User', {
    email: String,
    username: String,
    password: String,
    permission: Number
});

const Work = mongoose.model('Work', {
    name: String,
    priority: Number,
    users: [String]
});

var checkRegisterInfo = function (req, res, next) {
    res.locals.saved = req.body;

    if (typeof req.body.email === 'undefined' ||
        typeof req.body.username === 'undefined' ||
        typeof req.body.password1 === 'undefined' ||
        typeof req.body.password2 === 'undefined') {
        return next();
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            return next(err);
        }

        if (user !== null) {
            res.locals.emailinuse = null;
            return next();
        }

        if (req.body.password1 !== req.body.password2) {
            res.locals.wrongpassword = null;
            return next();
        }

        var newUser = new User();
        newUser.email = req.body.email;
        newUser.username = req.body.username;
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

var checkLoginInfo = function (req, res, next) {
    res.locals.saved = req.body;

    User.findOne({ email: req.body.email, password: md5(String(req.body.password)) }, function (err, user) {
        if (err) {
            return next(err);
        }

        if (user !== null) {
            res.locals.user = user;
        }

        return next();
    });
}

var sessionCreater = function (req, res, next) {
    if (typeof res.locals.user === 'undefined') {
        res.locals.wrongpassword = null;
        return next();
    }

    var newUser = {
        email: res.locals.user.email,
        username: res.locals.user.username,
        permission: res.locals.user.permission
    };

    req.session.user = newUser;

    return req.session.save(function (err) {
        if (err) {
            return next(err);
        }

        res.redirect('/worklist');
    });
}

var renderPage = function (pageName) {
    return function (req, res) {
        res.render(pageName);
    }
}

var isLoggedIn = (req, res, next) => {

    if (typeof req.session.user === 'undefined') {
        return res.redirect('/');
    }

    res.locals.session_user = req.session.user;
    return next();
}

var havePermission = function (permissionLevel) {
    return function (req, res, next) {
        if (req.session.user.permission !== permissionLevel) {
            return res.redirect('/');
        }

        return next();
    }
}

var destroySession = function (req, res) {
    req.session.destroy(err => {
        return res.redirect('/');
    });
}

var getUsers = function (req, res, next) {
    User.find({}, function (err, users) {
        if (err) {
            return next(err);
        }

        res.locals.users = users;
        return next();
    });
}

var getWorks = function (req, res, next) {
    Work.find({}, function (err, worklist) {
        if (err) {
            return next(err);
        }

        res.locals.worklist = worklist;
        return next();
    });
}

var getWork = function (req, res, next) {
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

var saveWork = function (req, res, next) {
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

var deleteWork = function (req, res, next) {
    if (typeof res.locals.work === 'undefined') {
        return next();
    }

    res.locals.work.remove(err => {
        if (err) {
            return next(err);
        }

        return res.redirect('/worklist')
    });
}

var getUser = function (req, res, next) {
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

var saveUser = function (req, res, next) {
    if (typeof req.body.email === 'undefined' ||
        typeof req.body.username === 'undefined' ||
        typeof req.body.permission === 'undefined') {
        return next();
    }

    if (typeof res.locals.user === 'undefined') {
        res.locals.user = new User();
    }

    res.locals.user.email = req.body.email;
    res.locals.user.username = req.body.username;
    res.locals.user.permission = req.body.permission;

    res.locals.user.save(err => {
        if (err) {
            return next(err);
        }

        return res.redirect('/users');
    });
}

var deleteUser = function (req, res, next) {
    if (typeof res.locals.user === 'undefined') {
        return next();
    }

    res.locals.user.remove(err => {
        if (err) {
            return next(err);
        }

        return res.redirect('/users')
    });
}

var addSelectedUser = function (req, res, next) {
    res.locals.work.users.push(res.locals.user.email);

    res.locals.work.save(err => {
        if (err) {
            return next(err);
        }

        return res.redirect(`/worklist/edit-work/${res.locals.work._id}`);
    });
}

var removeSelectedUser = function (req, res, next) {
    res.locals.work.users.remove(res.locals.user.email);

    res.locals.work.save(err => {
        if (err) {
            return next(err);
        }

        return res.redirect(`/worklist/edit-work/${res.locals.work._id}`);
    });
}

var getUserWorks = function (req, res, next) {
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

app.use('/register',
    (req, res, next) => {

        if (typeof req.session.user !== 'undefined') {
            return res.redirect('/worklist');
        }

        res.locals.user = req.session.user;
        return next();
    },
    checkRegisterInfo,
    renderPage('register'));

app.use('/worklist/new-work',
    isLoggedIn,
    havePermission(1),
    getWork,
    //getUsers,
    saveWork,
    renderPage('work_edit_new'));

app.use('/worklist/edit-work/:work_id/add-user/:user_id',
    isLoggedIn,
    havePermission(1),
    getUser,
    getWork,
    addSelectedUser);

app.use('/worklist/edit-work/:work_id/remove-user/:user_id',
    isLoggedIn,
    havePermission(1),
    getUser,
    getWork,
    removeSelectedUser);

app.use('/worklist/edit-work/:work_id',
    isLoggedIn,
    havePermission(1),
    getWork,
    getUsers,
    saveWork,
    renderPage('work_edit_new'));

app.use('/worklist/delete-work/:work_id',
    isLoggedIn,
    havePermission(1),
    getWork,
    deleteWork);

app.use('/worklist',
    isLoggedIn,
    havePermission(1),
    getWorks,
    renderPage('worklist'));

app.use('/user/worklist',
    isLoggedIn,
    //havePermission(0),
    function (req, res, next) {
        res.locals.alterview = null;

        return next();
    },
    getUserWorks,
    renderPage('worklist'));

app.use('/users/worklist-user/:user_id',
    isLoggedIn,
    havePermission(1),
    function (req, res, next) {
        res.locals.alterview = null;

        return next();
    },
    getUser,
    getUserWorks,
    renderPage('worklist'))

app.use('/users/new-user',
    isLoggedIn,
    havePermission(1),
    getUser,
    saveUser,
    renderPage('user_edit_new'));

app.use('/users/edit-user/:user_id',
    isLoggedIn,
    havePermission(1),
    getUser,
    saveUser,
    renderPage('user_edit_new'));

app.use('/users/delete-user/:user_id',
    isLoggedIn,
    havePermission(1),
    getUser,
    deleteUser);

app.use('/users',
    isLoggedIn,
    havePermission(1),
    getUsers,
    renderPage('users'));

app.use('/logout',
    destroySession);

app.post('/',
    function (req, res, next) {
        if (typeof req.session.user === 'undefined') {
            return next();
        }

        return res.redirect('/user/worklist');
    },
    checkLoginInfo,
    sessionCreater,
    renderPage('index'));

app.get('/',
    function (req, res, next) {
        if (typeof req.session.user === 'undefined') {
            return next();
        }

        return res.redirect('/user/worklist');
    },
    renderPage('index'));

app.use((err, req, res, next) => {
    res.end("Problem...");
    console.log(err);
});