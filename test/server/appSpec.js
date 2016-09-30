'use strict';

const createServer = require('../../server/createServer');
const supertest = require('supertest');
const path = require('path');
const test = require('ava');

test('serves the SPA HTML frame', () => {
    const server = createServer(path.join(__dirname, './fixtures/emptyReport.json'));
    const request = supertest(server);

    return request.get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/<script src="\/bundle.js">/)
        .expect(/<title>Gemini CI GUI<\/title>/);
});

test('inserts the initial gemini test results as an inline script', () => {
    const server = createServer(path.join(__dirname, './fixtures/emptyReport.json'));
    const request = supertest(server);

    return request.get('/')
        .expect(200)
        .expect(/<script>window\.geminiTestResults = \[\];<\/script>/);
});

test('responds with status code 500 if the report file can’t be read', () => {
    const server = createServer('/this/file/does/not/exist.json');
    const request = supertest(server);

    return request.get('/')
        .expect(500);
});
