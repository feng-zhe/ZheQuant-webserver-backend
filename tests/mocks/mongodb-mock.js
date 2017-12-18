/*
 * Mock module for mongodb
 */
'use strict';

const crypto = require('crypto');

const users = { // one test user with password 'test'
    users_: [ 
    {
        _id: crypto.randomBytes(16).toString('hex'),
        id: 'test',
        passwd: '098F6BCD4621D373CADE4E832627B4F6'
    }
    ],
    find(opt){
        //TODO
    },
    findOne(filter, callback){
        for (const user of this.users_){
            if (filter.id == user.id &&
                    filter.passwd == user.passwd){
                callback(undefined, user);
                return;
            }
        }
        callback('user not found');
    },
    updateOne(filter, update, callback){
        //TODO
    }
}

const jobResults = {
    jobs_: [],
    find(filter){
        const rst = {
            arr_: [],
            toArray(callback){
                callback(undefined,this.arr_);
                return;
            }
        };
        for (const job of this.jobs_){
            let flag = true;
            for (const field in filter){
                if (opt[field]!=job[field]){
                    flag = false;
                    break;
                }
            }
            if (flag){
                rst.arr_.push(job);
            }
        }
        return rst;
    },
    insertOne(job, callback){
        job._id = crypto.randomBytes(16).toString('hex'); // add _id
        this.jobs_.push(job);
        rst = 'ok'; // the caller don't care this value
        callback(undefined, rst);
    },
    updateOne(filter, update, callback){
        // find the job by filter
        for(const job in this.jobs_){
            let flag = true;
            for(const field in filter){
                if(job[field]!=filter[field]){
                    flag = false;
                }
            }
            if(flag){ 
                // job found, then update it directly 
                //because the job variable is a reference
                for(const field in update['$set']){
                    job[field]=update['$set'][field];
                }
                callback(undefined, 'ok');
                return;
            }
        }
        // not found
        callback('job not found');
        return;
    }
}

const db = {
    collection(clctName){
        switch (clctName){
            case 'job_results':
                return jobResults;
            case 'users':
                return users;
        }
    }
}

const MongoClient = {
    connect(url, callback){
        callback(undefined, db);
    },
}

const mock = {
    MongoClient: MongoClient,
    ObjectId(id){ // just return the input id string
        return id;
    }
};

module.exports = mock;
