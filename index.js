//const database = 'mongodb://localhost/CLXLCK';
const database = "mongodb+srv://school-user:school-password@school-project.9nu3u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const MongoStore = require('connect-mongo');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    store: MongoStore.create({ mongoUrl: database }),
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.set('view engine', 'ejs');



mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true });

require('./routing/routes')(app);

app.use((err, req, res, next) => {
    res.end("Problem...");
    console.log(err);
});

const server = app.listen(3000, function () {
    console.log("On: 3000");
});