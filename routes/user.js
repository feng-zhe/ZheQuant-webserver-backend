'use strict';

const express = require('express');
const storage = require('../libs/storage.js');

const router = express.Router();

// authentication
router.post('/auth', function(req, res, next) {
    const userId = req.body.userId;
    const password = req.body.password;
    if(!userId || !password){
        res.status(400).send();
    }
    // query the database
    storage.userLogin(userId, password, function(user) {
        if (user) {
            res.json({
                success: true,
                userId: user.id,
                token: user.passwd // TODO: currently use password as token
            });
        } else { // no such user
            res.json({
                success: false
            });
        }
    });
});

/*********************** holiday settings ***************************/
// return the legal holiday settings of this users
router.post('/settings/holidays', function(req, res, next) {
    const userId = req.body.userId;
    const token = req.body.token;
    if(!userId || !token){
        res.status(400).send();
    }
    storage.getUserSettingsHolidays(userId, token, function(holiday) {
        res.send(holiday);
    });
});

// create a new holiday
router.put('/settings/holidays', function(req, res, next) {
    const userId = req.body.userId;
    const token = req.body.token;
    const strData = req.body.data;
    const data = JSON.parse(req.body.data);
    if (!userId || !token || !strData || !data) {
        res.status(400).send();
    }
    data.year = parseInt(data.year);
    data.month = parseInt(data.month) - 1; // be aware that the month shoud be minus 1
    data.date = parseInt(data.date);
    storage.addOneUserSettingsHolidays(userId, token, data,
        function(n) {
            if (n) {
                res.send('success');
            } else {
                res.status(500).send('success');
            }
        });
});

// delete a holiday
router.delete('/settings/holidays', function(req, res, next) {
    const userId = req.body.userId;
    const token = req.body.token;
    const strData = req.body.data;
    const data = JSON.parse(strData);
    if (!userId || !token || !strData || !data) {
        res.status(400).send('error');
    }
    storage.deleteOneUserSettingsHolidays(userId, token, data,
        function(n) {
            if (n) {
                res.send('success');
            } else {
                res.status(500).send('error');
            }
        });
});

/*********************** special working days settings ***************************/
// return the special working days settings of this users
router.post('/settings/xworkings', function(req, res, next) {
    const userId = req.body.userId;
    const token = req.body.token;
    if(!userId || !token){
        res.status(400).send();
    }
    storage.getUserSettingsXWorkings(userId, token, function(xworkings) {
        res.send(xworkings);
    });
});

// create a new xworkings
router.put('/settings/xworkings', function(req, res, next) {
    const userId = req.body.userId;
    const token = req.body.token;
    const strData = req.body.data;
    const data = JSON.parse(req.body.data);
    if (!userId || !token || !strData || !data) {
        res.status(400).send();
    }
    data.year = parseInt(data.year);
    data.month = parseInt(data.month) - 1; // be aware that the month shoud be minus 1
    data.date = parseInt(data.date);
    storage.addOneUserSettingsXWorkings(userId, token, data,
        function(n) {
            if (n) {
                res.send();
            } else {
                res.status(500).send();
            }
        });
});

// delete a xworkings
router.delete('/settings/xworkings', function(req, res, next) {
    const userId = req.body.userId;
    const token = req.body.token;
    const strData = req.body.data;
    const data = JSON.parse(strData);
    if (!userId || !token || !strData || !data) {
        res.status(400).send('error');
    }
    storage.deleteOneUserSettingsXWorkings(userId, token, data,
        function(n) {
            if (n) {
                res.send();
            } else {
                res.status(500).send();
            }
        });
});

// export 
module.exports = router;
