'use strict';

const createResultHash = require('gemini-json-reporter/lib/createResultHash');
const R = require('ramda');
const mkdirp = require('mkdirp');
const fs = require('fs');
const readReportFile = require('./lib/readReportFile');
const Promise = require('bluebird');
const path = require('path');
const replaceInlineImagesWithPaths = require('./lib/replaceInlineImagesWithPaths');

function writeReport(reportFile, report) {
    const writeFile = Promise.promisify(fs.writeFile);

    return writeFile(reportFile, JSON.stringify(report));
}

function ensureFolderExists(file) {
    const folder = path.dirname(file);
    const createFolderRecursively = Promise.promisify(mkdirp.mkdirp);

    return createFolderRecursively(folder);
}

function updateReferenceImageFile(referencePath, base64EncodedImage) {
    const writeFile = Promise.promisify(fs.writeFile);

    return writeFile(referencePath, Buffer.from(base64EncodedImage, 'base64'));
}

function createSuccessResultFrom(result) {
    const successResult = {
        type: 'success',
        referencePath: result.referencePath,
        suitePath: result.suitePath,
        browserId: result.browserId,
        stateName: result.stateName
    };

    successResult.hash = createResultHash(successResult, Date.now());

    return successResult;
}

function saveReportChanges(reportFile, updatedResults, referencePath, referenceImage) {
    return Promise.all([
        writeReport(reportFile, updatedResults),
        updateReferenceImageFile(referencePath, referenceImage)
    ]);
}

function formatResponse(status, results, newHash) {
    return {
        status,
        results: replaceInlineImagesWithPaths(results),
        newHash
    };
}

function isValidOperation(operation) {
    return operation === 'approve' || operation === 'add-as-reference';
}

function canApprove(result) {
    return result.type === 'failure' && R.has('actual', result.images);
}

function canAddAsReference(result) {
    return result.type === 'error' && result.error.name === 'NoRefImageError';
}

function addAsReference(reportFile, results, result, index) {
    const successResult = createSuccessResultFrom(result);
    const updatedResults = R.update(index, successResult, results);

    return ensureFolderExists(result.referencePath)
        .then(() => saveReportChanges(reportFile, updatedResults, result.referencePath, result.images.actual))
        .then(() => formatResponse('accepted', updatedResults, successResult.hash));
}

function approve(reportFile, results, result, index) {
    const successResult = createSuccessResultFrom(result);
    const updatedResults = R.update(index, successResult, results);

    return saveReportChanges(reportFile, updatedResults, result.referencePath, result.images.actual)
        .then(() => formatResponse('approved', updatedResults, successResult.hash));
}

function sendResponse(res, formattedResponse) {
    res.status(200);
    res.json(formattedResponse);
}

module.exports = function createPatchResultsRouteHandler(reportFile) {
    return function (req, res, next) {
        const { op: operation, hash } = req.body;

        if (!isValidOperation(operation)) {
            return res.sendStatus(400);
        }

        return readReportFile(reportFile)
            .then((results) => {
                const result = R.find(R.whereEq({ hash }), results);
                const index = R.findIndex(R.whereEq({ hash }), results);

                if (!result) {
                    return res.sendStatus(404);
                }

                if (operation === 'approve' && canApprove(result)) {
                    return approve(reportFile, results, result, index)
                        .then((formattedResponse) => sendResponse(res, formattedResponse));
                } else if (operation === 'add-as-reference' && canAddAsReference(result)) {
                    return addAsReference(reportFile, results, result, index)
                        .then((formattedResponse) => sendResponse(res, formattedResponse));
                }

                return res.sendStatus(400);
            })
            .catch(next);
    };
};
