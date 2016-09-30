'use strict';

const R = require('ramda');

const removeHashes = R.map(R.omit([ 'hash' ]));

module.exports = function matchResults(expectedResults) {
    return function (payload) {
        const actualResults = JSON.parse(payload);
        const withoutHash = removeHashes(actualResults);

        return R.equals(expectedResults, withoutHash);
    };
};
