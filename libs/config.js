'use strict'

const fs = require('fs');

let content = fs.readFileSync(_appRoot + '/config-default.json');

// try to read customized configuration file
try {
    content = fs.readFileSync(_appRoot + '/config.json');
} catch (e) {}

module.exports = JSON.parse(content);
