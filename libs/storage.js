'use strict';

const MongoClient = require('mongodb').MongoClient;
const mongodb_url = require('./config.js').mongodb_url;

// authenticate the user and login
function userLogin(userId, password, cb) {
    MongoClient.connect(mongodb_url, function(err, db) {
        if (err) {
            console.log('[ERROR]', err);
            cb(); // reutrn null if connect failed
            return;
        }
        db.collection('users')
            .findOne({
                id: userId,
                passwd: password.toUpperCase()
            }, function(err, user) {
                if (err) {
                    console.log('[ERROR]', err);
                    cb();
                    return;
                }
                cb(user); // be aware that the user can be null if not find, this is not error
            });
    });
}

// user authenticate by token
function _userAuth(userId, token, db, cb) {
    db.collection('users')
        .findOne({
            id: userId,
            passwd: token.toUpperCase() // TODO: use token
        }, cb);
}

function userAuth(userId, token, cb) {
    MongoClient.connect(mongodb_url, function(err, db) {
        db.collection('users')
            .findOne({
                id: userId,
                passwd: token.toUpperCase() // TODO: use token
            }, cb);
    });
}

// return the user settings about holidays
function getUserSettingsHolidays(userId, token, cb) {
    MongoClient.connect(mongodb_url, function(err, db) {
        if (err) {
            console.log('[ERROR]', err);
            cb([]);
            return;
        }
        _userAuth(userId, token, db, function(err, user) {
            if (err) {
                console.log('[ERROR]', err);
                cb([]);
                return;
            }
            if (user) {
                cb(user.holidays);
            } else {
                cb([]);
            }
        });
    });
}

// add a new entry into holidays
// return number of changed
function addOneUserSettingsHolidays(userId, token, newItem, cb) {
    MongoClient.connect(mongodb_url, function(err, db) {
        if (err) {
            console.log('[ERROR]', err);
            cb(0);
            return;
        }
        _userAuth(userId, token, db, function(err, user) { // user authenticate
            if (err) {
                console.log('[ERROR]', err);
                cb(0);
                return;
            }
            const holidays = user.holidays ? user.holidays : []; // it could be null
            holidays.push({
                year: newItem.year,
                month: newItem.month,
                date: newItem.date
            });
            holidays.sort(function(a, b) {
                if (a.year != b.year) {
                    return a.year - b.year;
                } else {
                    if (a.month != b.month) {
                        return a.month - b.month;
                    } else {
                        if (a.date != b.date) {
                            return a.date - b.date;
                        } else {
                            return 0;
                        }
                    }
                }
            });
            db.collection('users')
                .updateOne({
                        id: user.id
                    }, {
                        $set: {
                            holidays: holidays
                        }
                    },
                    function(err, data) {
                        if (err) {
                            console.log('[ERROR]', err);
                            cb(0);
                            return;
                        }
                        cb(data.result.n);
                    });
        });
    });
}

// delete an entry into holidays
// return number of changed
function deleteOneUserSettingsHolidays(userId, token, oldItem, cb) {
    MongoClient.connect(mongodb_url, function(err, db) {
        if (err) {
            console.log('[ERROR]', err);
            cb(0);
            return;
        }
        _userAuth(userId, token, db, function(err, user) { // user authenticate
            if (err) {
                console.log('[ERROR]', err);
                cb(0);
                return;
            }
            const oldHolidays = user.holidays;
            const newHolidays = [];
            // copy holidays and skip the item to be delete
            for (const value of oldHolidays) {
                if (value.year === oldItem.year &&
                    value.month === oldItem.month &&
                    value.date === oldItem.date) {
                    continue;
                }
                newHolidays.push(value);
            }
            db.collection('users')
                .updateOne({
                        id: user.id
                    }, {
                        $set: {
                            holidays: newHolidays
                        }
                    },
                    function(err, data) {
                        if (err) {
                            console.log('[ERROR]', err);
                            cb(0);
                            return;
                        }
                        cb(data.result.n);
                    });
        });
    });
}

// return the user settings about special working days
function getUserSettingsXWorkings(userId, token, cb) {
    MongoClient.connect(mongodb_url, function(err, db) {
        if (err) {
            console.log('[ERROR]', err);
            cb([]);
            return;
        }
        _userAuth(userId, token, db, function(err, user) {
            if (err) {
                console.log('[ERROR]', err);
                cb([]);
                return;
            }
            if (user && user.xworkings) {
                cb(user.xworkings);
            } else {
                cb([]);
            }
        });
    });
}

// add a new entry into special working days
// return the number of changed
function addOneUserSettingsXWorkings(userId, token, newItem, cb) {
    MongoClient.connect(mongodb_url, function(err, db) {
        if (err) {
            console.log('[ERROR]', err);
            cb(0);
            return;
        }
        _userAuth(userId, token, db, function(err, user) { // user authenticate
            if (err) {
                console.log('[ERROR]', err);
                cb(0);
                return;
            }
            const xworkings = (user.xworkings ? user.xworkings : []); // be careful it could be undefined
            xworkings.push({
                year: newItem.year,
                month: newItem.month,
                date: newItem.date
            });
            xworkings.sort(function(a, b) {
                if (a.year != b.year) {
                    return a.year - b.year;
                } else {
                    if (a.month != b.month) {
                        return a.month - b.month;
                    } else {
                        if (a.date != b.date) {
                            return a.date - b.date;
                        } else {
                            return 0;
                        }
                    }
                }
            });
            db.collection('users')
                .updateOne({
                        id: user.id
                    }, {
                        $set: {
                            xworkings: xworkings
                        }
                    },
                    function(err, data) {
                        if (err) {
                            console.log('[ERROR]', err);
                            cb(0);
                            return;
                        }
                        cb(data.result.n);
                    });
        });
    });
}

// delete an entry into holidays
// return number of changed
function deleteOneUserSettingsXWorkings(userId, token, oldItem, cb) {
    MongoClient.connect(mongodb_url, function(err, db) {
        if (err) {
            console.log('[ERROR]', err);
            cb(0);
            return;
        }
        _userAuth(userId, token, db, function(err, user) { // user authenticate
            if (err) {
                console.log('[ERROR]', err);
                cb(0);
                return;
            }
            const oldXWorkings = user.xworkings;
            const newXWorkings = [];
            // copy holidays and skip the item to be delete
            for (const value of oldXWorkings) {
                if (value.year === oldItem.year &&
                    value.month === oldItem.month &&
                    value.date === oldItem.date) {
                    continue;
                }
                newXWorkings.push(value);
            }
            db.collection('users')
                .updateOne({
                        id: user.id
                    }, {
                        $set: {
                            xworkings: newXWorkings
                        }
                    },
                    function(err, data) {
                        if (err) {
                            console.log('[ERROR]', err);
                            cb(0);
                            return;
                        }
                        cb(data.result.n);
                    });
        });
    });
}

function getJobResults(userId, token, cb) {
    MongoClient.connect(mongodb_url, function(err, db) {
        if (err) {
            cb(err);
            return;
        }
        _userAuth(userId, token, db, function(err, user) { // user authenticate
            if (err) {
                cb(err);
                return;
            }
            db.collection('job_results')
                .find({
                    creator: userId
                })
                .toArray(function(err, results) {
                    if (err) {
                        cb(err);
                        return;
                    }
                    cb(undefined, results);
                });
        });
    });
}

function addNewJob(userId, token, job, cb) {
    MongoClient.connect(mongodb_url, function(err, db) {
        if (err) {
            cb(err);
            return;
        }
        _userAuth(userId, token, db, function(err, user) { // user authenticate
            if (err) {
                cb(err);
                return;
            }
            // write to database
            db.collection('job_results')
                .insertOne(job, function(err, r) {
                    cb(err, r);
                });
        });
    });
}

function updateJob(job, cb) {
    MongoClient.connect(mongodb_url, function(err, db) {
        if (err) {
            cb(err);
            return;
        }
        // this function is not called by user, so there is no user authentication
        // write to database
        db.collection('job_results')
            .updateOne({
                name: job.name,
                creator: job.creator,
                create_date: job.create_date
            }, {
                $set: {
                    status: job.status,
                    result: job.result
                }
            }, function(err, r) {
                cb(err, r);
            });
    });
}

//exports
module.exports.userLogin = userLogin;
module.exports.userAuth = userAuth;
module.exports.getUserSettingsHolidays = getUserSettingsHolidays;
module.exports.getUserSettingsXWorkings = getUserSettingsXWorkings;
module.exports.addOneUserSettingsHolidays = addOneUserSettingsHolidays;
module.exports.addOneUserSettingsXWorkings = addOneUserSettingsXWorkings;
module.exports.deleteOneUserSettingsHolidays = deleteOneUserSettingsHolidays;
module.exports.deleteOneUserSettingsXWorkings = deleteOneUserSettingsXWorkings;
module.exports.getJobResults = getJobResults;
module.exports.addNewJob = addNewJob;
module.exports.updateJob = updateJob;
