const Work = require("./../models/work");
const User = require("./../models/user");
const isLoggedIn = require("./../middleware/auth/isLoggedIn");
const checkRegisterInfo = require("./../middleware/auth/checkRegisterInfo");
const checkLoginInfo = require("./../middleware/auth/checkLoginInfo");
const sessionCreater = require("./../middleware/auth/sessionCreater");
const havePermission = require("./../middleware/auth/havePermission");
const destroySession = require("./../middleware/auth/destroySession");

const getUsers = require("./../middleware/user/getUsers");
const getUser = require("./../middleware/user/getUser");
const saveUser = require("./../middleware/user/saveUser");
const deleteUser = require("./../middleware/user/deleteUser");
const getUserWorks = require("./../middleware/user/getUserWorks");

const getWorks = require("./../middleware/work/getWorks");
const getWork = require("./../middleware/work/getWork");
const saveWork = require("./../middleware/work/saveWork");
const deleteWork = require("./../middleware/work/deleteWork");
const addSelectedUser = require("./../middleware/work/addSelectedUser");
const removeSelectedUser = require("./../middleware/work/removeSelectedUser");

const renderPage = require("./../middleware/renderPage");

module.exports = function (app) {
    const objectRepository = {
        User: User,
        Work: Work
    };

    app.use('/register',
        (req, res, next) => {

            if (typeof req.session.user !== 'undefined') {
                return res.redirect('/worklist');
            }

            res.locals.user = req.session.user;
            return next();
        },
        checkRegisterInfo(objectRepository),
        renderPage(objectRepository, 'register'));

    app.use('/worklist/new-work',
        isLoggedIn(objectRepository),
        havePermission(objectRepository, 1),
        getWork(objectRepository),
        saveWork(objectRepository),
        renderPage(objectRepository, 'work_edit_new'));

    app.use('/worklist/edit-work/:work_id/add-user/:user_id',
        isLoggedIn(objectRepository),
        havePermission(objectRepository, 1),
        getUser(objectRepository),
        getWork(objectRepository),
        addSelectedUser(objectRepository));

    app.use('/worklist/edit-work/:work_id/remove-user/:user_id',
        isLoggedIn(objectRepository),
        havePermission(objectRepository, 1),
        getUser(objectRepository),
        getWork(objectRepository),
        removeSelectedUser(objectRepository));

    app.use('/worklist/edit-work/:work_id',
        isLoggedIn(objectRepository),
        havePermission(objectRepository, 1),
        getWork(objectRepository),
        getUsers(objectRepository),
        saveWork(objectRepository),
        renderPage(objectRepository, 'work_edit_new'));

    app.use('/worklist/delete-work/:work_id',
        isLoggedIn(objectRepository),
        havePermission(objectRepository, 1),
        getWork(objectRepository),
        deleteWork(objectRepository));

    app.use('/worklist',
        isLoggedIn(objectRepository),
        havePermission(objectRepository, 1),
        getWorks(objectRepository),
        renderPage(objectRepository, 'worklist'));

    app.use('/user/worklist',
        isLoggedIn(objectRepository),
        function (req, res, next) {
            res.locals.alterview = null;

            return next();
        },
        getUserWorks(objectRepository),
        renderPage(objectRepository, 'worklist'));

    app.use('/users/worklist-user/:user_id',
        isLoggedIn(objectRepository),
        havePermission(objectRepository, 1),
        function (req, res, next) {
            res.locals.alterview = null;

            return next();
        },
        getUser(objectRepository),
        getUserWorks(objectRepository),
        renderPage(objectRepository, 'worklist'))

    app.use('/users/new-user',
        isLoggedIn(objectRepository),
        havePermission(objectRepository, 1),
        getUser(objectRepository),
        saveUser(objectRepository),
        renderPage(objectRepository, 'user_edit_new'));

    app.use('/users/edit-user/:user_id',
        isLoggedIn(objectRepository),
        havePermission(objectRepository, 1),
        getUser(objectRepository),
        saveUser(objectRepository),
        renderPage(objectRepository, 'user_edit_new'));

    app.use('/users/delete-user/:user_id',
        isLoggedIn(objectRepository),
        havePermission(objectRepository, 1),
        getUser(objectRepository),
        deleteUser(objectRepository));

    app.use('/users',
        isLoggedIn(objectRepository),
        havePermission(objectRepository, 1),
        getUsers(objectRepository),
        renderPage(objectRepository, 'users'));

    app.use('/logout',
        destroySession(objectRepository));

    app.post('/',
        function (req, res, next) {
            if (typeof req.session.user === 'undefined') {
                return next();
            }

            return res.redirect('/user/worklist');
        },
        checkLoginInfo(objectRepository),
        sessionCreater(objectRepository),
        renderPage(objectRepository, 'index'));

    app.get('/',
        function (req, res, next) {
            if (typeof req.session.user === 'undefined') {
                return next();
            }

            return res.redirect('/user/worklist');
        },
        renderPage(objectRepository, 'index'));
}