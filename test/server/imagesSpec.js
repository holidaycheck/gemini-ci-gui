'use strict';

const createServer = require('../../server/createServer');
const supertest = require('supertest');
const path = require('path');
const test = require('ava');

const base64EncodedPixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAA' +
    'ABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF' +
    '3CculE8AAAABlBMVEUAAID+/v4nXkIGAAAAAWJLR0QB/wIt3gAAAApJREFUCNdjYAAAAAI' +
    'AAeIhvDMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMTAtMDNUMTc6NTQ6MDIrMDI6MDDhc' +
    'bhPAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTEwLTAzVDE3OjU0OjAyKzAyOjAwkCwA8wA' +
    'AAABJRU5ErkJggg==';

const pixelBuffer = Buffer.from(base64EncodedPixel, 'base64');

const reportFile = path.join(__dirname, './fixtures/reportWithOneResult.json');

test('serves the actual image for the given result hash', (t) => {
    const server = createServer(reportFile);
    const request = supertest(server);

    return request.get('/images/any-result-hash/actual')
        .expect(200)
        .expect('Content-Type', 'image/png')
        .expect((res) => {
            t.deepEqual(res.body, pixelBuffer);
        });
});

test('serves the diff image for the given result hash', (t) => {
    const server = createServer(reportFile);
    const request = supertest(server);

    return request.get('/images/any-result-hash/diff')
        .expect(200)
        .expect('Content-Type', 'image/png')
        .expect((res) => {
            t.deepEqual(res.body, pixelBuffer);
        });
});

test('serves the reference image for the given result hash', (t) => {
    const server = createServer(reportFile);
    const request = supertest(server);

    return request.get('/images/any-result-hash/reference')
        .expect(200)
        .expect('Content-Type', 'image/png')
        .expect((res) => {
            t.deepEqual(res.body, pixelBuffer);
        });
});

test('responds with 500 when the reportFile can’t be read', () => {
    const server = createServer('/this/file/does/not/exist.json');
    const request = supertest(server);

    return request.get('/images/any-result-hash/diff')
        .expect(500);
});

test('responds with 404 when a result for the given hash can’t be found', () => {
    const server = createServer(reportFile);
    const request = supertest(server);

    return request.get('/images/non-existing-hash/diff')
        .expect(404);
});

test('responds with 404 when the requested image type for the result does not exist', () => {
    const server = createServer(reportFile);
    const request = supertest(server);

    return request.get('/images/any-result-hash/non-existing-type')
        .expect(404);
});

test('responds with 404 when the reference image file for the requested result dos not exist', () => {
    const server = createServer(path.join(__dirname, './fixtures/reportWithMissingReferenceImage.json'));
    const request = supertest(server);

    return request.get('/images/any-result-hash/reference')
        .expect(404);
});
