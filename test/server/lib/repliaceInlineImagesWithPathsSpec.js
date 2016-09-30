'use strict';

const replaceInlineImagesWithPaths = require('../../../server/lib/replaceInlineImagesWithPaths');
const test = require('ava');

test('removes the referencePath from each result and adds the respective image API path to images.reference', (t) => {
    const results = [
        { hash: 'result-1', referencePath: '/foo/image1.png' },
        { hash: 'result-2', referencePath: '/bar/image2.png' }
    ];
    const expectedResults = [
        { hash: 'result-1', images: { reference: '/images/result-1/reference' } },
        { hash: 'result-2', images: { reference: '/images/result-2/reference' } }
    ];

    t.deepEqual(replaceInlineImagesWithPaths(results), expectedResults);
});

test('replaces base64 encoded inline images with their respective image API path when present', (t) => {
    const results = [
        { hash: 'result-1', referencePath: '/foo/image1.png' },
        {
            hash: 'result-2',
            referencePath: '/bar/image2.png',
            images: { actual: '<base64 encoded data>', diff: '<base64 encoded data>' }
        }
    ];
    const expectedResults = [
        { hash: 'result-1', images: { reference: '/images/result-1/reference' } },
        {
            hash: 'result-2',
            images: {
                actual: '/images/result-2/actual',
                diff: '/images/result-2/diff',
                reference: '/images/result-2/reference'
            }
        }
    ];

    t.deepEqual(replaceInlineImagesWithPaths(results), expectedResults);
});
