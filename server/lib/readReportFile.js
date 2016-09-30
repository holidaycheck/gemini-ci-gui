'use strict';

const fs = require('fs');
const Promise = require('bluebird');

module.exports = function readReportFile(reportFile) {
    const readFile = Promise.promisify(fs.readFile);

    return readFile(reportFile)
        .then((buffer) => JSON.parse(buffer.toString()));
};
