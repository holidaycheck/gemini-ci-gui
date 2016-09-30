'use strict';

/* eslint-disable no-process-env */

const createServer = require('./createServer');

const reportFile = process.env.REPORT_FILE;
const server = createServer(reportFile);

server.listen(3000);
