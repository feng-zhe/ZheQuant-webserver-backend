/*
 * Mock module for rabbitmq for testing purposes
 */
'use strict';

const queues = {
    'jobs-todo':{
        'listeners':[]
    },
    'jobs-done':{
        'listeners':[]
    }
}

const mock = {
    connect(url, callback){  // es6 func in obj declaration
        const mock_conn = {
            createChannel(callback){
                const mock_ch = {
                    assertQueue(qname, option){},
                    sendToQueue(qname, msg_buff){
                        // call the listeners directly
                        for (const cb of queues[qname]['listeners']) {
                            cb(msg_buff);
                        }
                    },
                    consume(qname, callback){
                        // register into listener list
                        queues[qname]['listeners'].push(callback);
                    },
                    ack(msg){}
                }
                callback(undefined, mock_ch);
            }
        }
        callback(undefined, mock_conn);
    }
}

module.exports = mock;
