'use strict';

/* eslint-disable no-process-env */
/* eslint-disable no-console */

const createServer = require('./createServer');

const reportFile = process.env.REPORT_FILE;
const port = process.env.PORT || 3000;
const server = createServer(reportFile);

if (!reportFile) {
    throw new Error('REPORT_FILE is not defined');
}

server.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
