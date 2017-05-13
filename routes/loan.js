'use strict';

const express = require('express');
const lib = require('../libs/general');
const storage = require('../libs/storage');

const router = express.Router();

router.post('/', function(req, res, next) {
    if( !req.body.userId ||
        !req.body.token ||
        !req.body.startDate||
        !req.body.intervalType||
        !req.body.intervalValue||
        !req.body.totalTimes){
        res.status(400).send('missing inputs');
        return;
    }
    // TODO: validate
    //
    // calculation
    const userId = req.body.userId;
    const token = req.body.token;
    const startDate = new Date(req.body.startDate); // no need to be UTC
    const intervalType = req.body.intervalType;
    const intervalValue = parseInt(req.body.intervalValue);
    const totalTimes = parseInt(req.body.totalTimes);
    // auth the user
    storage.userAuth(userId, token, function(err, user){
        if(err){
            console.log('[ERROR]', err);
            res.status(500).send('error');
        }
        try {
            console.log('receive a loan repayment date calculation request from user:', userId);
            let repayDates = lib.calcLoanRepayDates(startDate, intervalType, intervalValue, totalTimes, user.holidays, user.xworkings);
            res.send({
                repayDates: repayDates
            });
        } catch (ex) {
            console.log('calculating repayment dates failed, exception:');
            console.log(ex);
            res.status(500).send('internal error');
        }
    });
});

// export 
module.exports = router;
