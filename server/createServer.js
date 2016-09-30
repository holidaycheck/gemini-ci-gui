'use strict';

const express = require('express');
const path = require('path');
const createPatchResultsRouteHandler = require('./results');
const createAppRouteHandler = require('./app');
const createImagesRouteHandler = require('./images');
const bodyParser = require('body-parser');

function cacheHeaderMiddleware(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    next();
}

module.exports = function createServer(reportFile, assetsFolder = `${process.cwd()}/dist`) {
    const server = express();

    server.set('etag', false);
    server.use(cacheHeaderMiddleware);
    server.use(bodyParser.json());
    server.use('/bundle.js', express.static(path.join(assetsFolder, './bundle.js')));

    server.get('/', createAppRouteHandler(reportFile));
    server.get('/images/:hash/:type', createImagesRouteHandler(reportFile));
    server.patch('/api/results', createPatchResultsRouteHandler(reportFile));

    return server;
};
