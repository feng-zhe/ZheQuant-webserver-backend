'use strict';

/*
 * set global variables
 */
global._appRoot = __dirname;

/*
 * reuqired modules
 */
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const loanRouter = require('./routes/loan');
const userRouter = require('./routes/user');
const quantRouter = require('./routes/quant');

const app = express();

app.use(cors()); // for cross origin resource sharing
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// for loan api
app.use('/loan', loanRouter);

// for user api
app.use('/user', userRouter);

// for quant api
app.use('/quant',quantRouter);

// return the web page when visit root
app.get('/', function(req, res, next) {
    res.sendFile('src/views/index.html', {
        root: __dirname
    });
});

// no favico.ico
app.get('/favicon.ico', function(req, res, next) {
    res.status(204).send();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    console.log('[ERROR]', err);
    res.status(err.status).send('error');
});

module.exports = app;
