'use strict';

const express = require('express');
const storage = require(_appRoot + '/libs/storage');
const amqp = require('amqplib/callback_api');

const rabbitmq_url = require(_appRoot + '/config.json').rabbitmq_url;
const router = express.Router();

router.post('/results', function(req, res, next) {
    if (!req.body.userId ||
        !req.body.token) {
        res.status(400).send('missing inputs');
        return;
    }
    const userId = req.body.userId;
    const token = req.body.token;
    // get job results of this user
    storage.getJobResults(userId, token, function(err, results) {
        if (err) {
            res.status(err.status || 500).send('error');
            return;
        }
        res.send({
            results: results
        });
    });
});

router.post('/jobs', function(req, res, next) {
    if (!req.body.userId ||
        !req.body.token ||
        !req.body.job_name) {
        res.status(400).send('missing inputs');
        return;
    }
    const userId = req.body.userId;
    const token = req.body.token;
    const job_name = req.body.job_name;
    const description = req.body.description;
    const cmd = req.body.cmd;
    // add the job into the database and job queue
    const job = {
        name: job_name,
        creator: userId,
        create_date: new Date(),
        status: 'waiting',
        description: description,
        cmd: cmd
    };
    // try to connect rabbitmq, if fail, stop adding
    amqp.connect(rabbitmq_url, function(err, conn) {
        if (err) {
            console.log('[ERROR]', 'adding job aborted, error:', err);
            res.status(err.status || 500).send('error');
            return;
        }
        storage.addNewJob(userId, token, job,  function(err, result) {
            if (err) {
                res.status(err.status || 500).send('error');
                return;
            } else {
                conn.createChannel(function(err, ch) {
                    if (err) {
                        res.status(err.status || 500).send('error');
                        console.log('[ERROR]', err);
                        return;
                    }
                    const qname = 'jobs-todo';
                    ch.assertQueue(qname, {
                        durable: true
                    });
                    ch.sendToQueue(qname, Buffer.from(JSON.stringify(job)));
                    console.log('[INFO]', 'job has been sent to rabbitmq');
                    res.send('success');
                });
            }
        });
    });
});

// message listener
(function listener(){
    amqp.connect(rabbitmq_url, function(err, conn) {
        if (err) {
            console.log('[ERROR]', err);
            console.log('[INFO]', 'retry few seconds later...');
            setTimeout(listener, 500);
            return;
        }
        conn.createChannel(function(err, ch) {
            if (err) {
                console.log('[ERROR]', err);
                return;
            }
            const qname = 'jobs-done';
            ch.assertQueue(qname, {
                durable: true
            });
            ch.consume(qname, function(msg) {
                console.log('received a message from ', qname + ':', msg.content.toString());
                ch.ack(msg);
                // update database
                const job = JSON.parse(msg.content.toString());
                job.create_date = new Date(job.create_date);
                storage.updateJob(job, function() {});
            }, {
                noAck: false
            });
        });
    });
})();

// export 
module.exports = router;
