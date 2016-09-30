'use strict';

const readReportFile = require('./lib/readReportFile');
const R = require('ramda');
const fs = require('fs');
const Promise = require('bluebird');

module.exports = function createImagesRouteHandler(reportFile) {
    const readFile = Promise.promisify(fs.readFile);

    return function (req, res, next) {
        readReportFile(reportFile)
            .then((results) => {
                const result = R.find(R.whereEq({ hash: req.params.hash }), results);

                if (result && result.images && result.images[req.params.type]) {
                    res.type('png');
                    res.send(Buffer.from(result.images[req.params.type], 'base64'));
                } else if (result && result.referencePath && req.params.type === 'reference') {
                    readFile(result.referencePath)
                        .then((buffer) => {
                            res.type('png');
                            res.send(buffer);
                        })
                        .catch(() => {
                            res.sendStatus(404);
                        });
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(next);
    };
};
