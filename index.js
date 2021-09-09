const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

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

require('./routing/routes')(app);

app.use((err, req, res, next) => {
    res.end("Problem...");
    console.log(err);
});

const server = app.listen(3000, function () {
    console.log("On: 3000");
});