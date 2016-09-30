'use strict';

const R = require('ramda');

module.exports = function replaceInlineImagesWithPaths(results) {
    return results.map((result) => {
        const imagePaths = { reference: `/images/${result.hash}/reference` };

        if (result.images) {
            imagePaths.actual = `/images/${result.hash}/actual`;
            imagePaths.diff = `/images/${result.hash}/diff`;
        }

        return R.omit([ 'referencePath' ], R.assoc('images', imagePaths, result));
    });
};
