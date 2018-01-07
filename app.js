'use strict';

/*
 * set global variables
 */
global._appRoot = __dirname;

/*
 * if NODE_ENV is 'dev|development', use mock modules
 * so that we can test this component isolatedly
 */
const mockery = require('mockery');
if (process.env.NODE_ENV == 'dev' || 
        process.env.NODE_ENV == 'development'){
    mockery.enable({
        warnOnUnregistered: false
    });
    mockery.registerSubstitute('amqplib/callback_api', _appRoot + '/mocks/amqp-mock');
    mockery.registerSubstitute('mongodb', _appRoot + '/mocks/mongodb-mock');
}

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

// for loan api
app.use('/loan', loanRouter);

// for user api
app.use('/user', userRouter);

// for quant api
app.use('/quant',quantRouter);

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
