'use strict';

/****************************** constants ******************************/
const DAY = 'DAY';
const MONTH = 'MONTH';
const YEAR = 'YEAR';

/****************************** functions ******************************/
/*
 * startDate: Date(). The start date of the repayment counting (local, not the UTC time)
 * intervalType: String. The interval type
 * intervalValue: Number. The interval value
 * times: Number. The total times of repayment
 * returns an array of repayment date
 */
function calcLoanRepayDates(startDate, intervalType, intervalValue, totalTimes, holidays, xworkings) {
    switch (intervalType) {
        case MONTH:
            return calcLoanRepayDates_month(startDate, intervalValue, totalTimes, holidays, xworkings);
            break;
        default:
            console.log(`interval type ${intervalType} is not supported`);
            throw (new Error('interval type not supported'));
            break;
    }
}

// intervalM: only the value. e.g. 3 -> 3 months
function calcLoanRepayDates_month(startDate, intervalM, totalTimes, holidays, xworkings) {
    // determine whether the date is a working day
    function isWorkingDay(year, month, date) {
        // holiday?
        if (isInRange(year, month, date, holidays)) {
            console.log(year, month, date, 'is a holiday');
            return false;
        }
        // special working day?
        if (isInRange(year, month, date, xworkings)) {
            console.log(year, month, date, 'is a special working day');
            return true;
        }
        // weekend?
        const temp = new Date(year, month, date);
        if (temp.getDay() === 0 || temp.getDay() === 6) {
            console.log(year, month, date, 'is a normal weekend');
            return false;
        }
        else {
            console.log(year, month, date, 'is a normal working day');
            return true;
        }
    }
    const START_DATE = startDate;
    const INTERVAL_M = intervalM;
    const TOTAL_TIMES = totalTimes;
    const result = [];
    let year = START_DATE.getFullYear(),
        month = START_DATE.getMonth();
    const DATE = START_DATE.getDate();
    for (let i = 0; i < TOTAL_TIMES; ++i) {
        month += intervalM; // try next
        if(month >= 12){ // month exceeded this year
            year++;
            month %= 12;
        }
        let forward = true; // indicator of trying forward
        let tempDate = DATE;
        while(!isWorkingDay(year, month, tempDate)){
            if(forward){ // try forward
                const temp = new Date(year, month, ++tempDate);
                if(temp.getMonth()!==month){ // exceeded this month
                    forward = false;
                    --tempDate;
                    continue;
                }             
                console.log('trying forward', year, month, tempDate);
            }
            else{ // try backward
                --tempDate;
                console.log('trying forward', year, month, tempDate);
            }
        }
        console.log('pushing',year, month, tempDate, 'to result');
        result.push({
            year,
            month,
            date : tempDate
        });
    }
    return result;
}

// general helper function
function isInRange(year, month, date, range) { // assuming range is sorted already and continuous years
    const min_date = range[0];
    const max_date = range[range.length - 1];
    const input = {
        year: year,
        month: month,
        date: date
    };
    const unknown_year =  input.year<min_date.year || input.year>max_date.year ; // holiday for corresponding year is unkown
    if(unknown_year){
        console.log(year, month, date, 'is beyond input range, using last year in input range')
        input.year = max_date.year; // if unkown-holiday year, use the latest known-holiday year
    }
    // before this loop, we should already have set the input.year among known-holiday year
    for (const elem of range) {
        const cmp = compareTwoDate(input, elem);
        if (cmp === 0) {
            return true;
        } else if (cmp < 0) { // the rest will be bigger and won't equal
            return false;
        }
    }
    return false;
}

function compareTwoDate(dateObj1, date2Obj) { // return -1 if dateObj1 < date2Obj
    if (dateObj1.year < date2Obj.year) {
        return -1;
    } else if (dateObj1.year > date2Obj.year) {
        return 1;
    } else { // same year
        if (dateObj1.month < date2Obj.month) {
            return -1;
        } else if (dateObj1.month > date2Obj.month) {
            return 1;
        } else { // same month
            if (dateObj1.date < date2Obj.date) {
                return -1;
            } else if (dateObj1.date > date2Obj.date) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}

module.exports.calcLoanRepayDates = calcLoanRepayDates;
