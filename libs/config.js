'use strict'

const fs = require('fs');

let config = fs.readFileSync(_appRoot + '/config-default.json');

// try to read customized configuration file
try {
    config = fs.readFileSync(_appRoot + '/config.json');
} catch (e) {}

export config;
