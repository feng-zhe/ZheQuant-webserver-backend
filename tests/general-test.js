'use strict';

const lib = require('../libs/general');

/******************** test cases ********************/
const date1 = new Date();
const interval1 = {
    type: 'MONTH',
    value: 1
};
const times1 = 12;
const result1 = lib.calcLoanRepayDates(date1, interval1, times1);
console.log(result1);
