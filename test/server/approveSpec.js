'use strict';

const createServer = require('../../server/createServer');
const supertest = require('supertest');
const path = require('path');
const fs = require('fs');
const sinon = require('sinon');
const test = require('ava');
const matchResults = require('./matchResults');

const reportFile = path.join(__dirname, './fixtures/reportWithFailure.json');

let writeFile;

test.before(() => {
    writeFile = sinon.stub(fs, 'writeFile');
    writeFile.yields(null);
});

test.after(() => {
    writeFile.restore();
});

test('updates the failure result in the report file and the reference image', (t) => {
    const server = createServer(reportFile);
    const request = supertest(server);
    const expectedResult = {
        type: 'success',
        referencePath: '/reference/image.png',
        suitePath: [ 'foo', 'bar' ],
        stateName: 'plain',
        browserId: 'firefox'
    };

    t.plan(2);

    return request.patch('/api/results')
        .send({ op: 'approve', hash: 'any-result-hash' })
        .expect(200)
        .then(() => {
            t.true(writeFile.calledWith('/reference/image.png'));
            t.true(writeFile.calledWith(reportFile, sinon.match(matchResults([ expectedResult ]))));
        });
});

test('responds with the new report', (t) => {
    const server = createServer(reportFile);
    const request = supertest(server);

    t.plan(4);

    return request.patch('/api/results')
        .send({ op: 'approve', hash: 'any-result-hash' })
        .expect(200)
        .expect((res) => {
            t.is(res.body.status, 'approved');
            t.not(res.body.newHash, 'any-result-hash');
            t.is(res.body.results.length, 1);
            t.is(res.body.results[0].hash, res.body.newHash);
        });
});

test('provides all images in the response by their image API URI', (t) => {
    const server = createServer(reportFile);
    const request = supertest(server);

    t.plan(2);

    return request.patch('/api/results')
        .send({ op: 'approve', hash: 'any-result-hash' })
        .expect(200)
        .expect((res) => {
            const expectedImages = {
                reference: `/images/${res.body.newHash}/reference`
            };

            t.is(res.body.results.length, 1);
            t.deepEqual(res.body.results[0].images, expectedImages);
        });
});

test('responds with 400 status when the given result hash does not belong to a failuire result', () => {
    const server = createServer(path.join(__dirname, './fixtures/reportWithOneResult.json'));
    const request = supertest(server);

    return request.patch('/api/results')
        .send({ op: 'approve', hash: 'any-result-hash' })
        .expect(400);
});

test('responds with 400 status when the given operation is not supported', () => {
    const server = createServer(reportFile);
    const request = supertest(server);

    return request.patch('/api/results')
        .send({ op: 'foo', hash: 'any-result-hash' })
        .expect(400);
});

test('responds with 404 when no result for the given hash can be found', () => {
    const server = createServer(reportFile);
    const request = supertest(server);

    return request.patch('/api/results')
        .send({ op: 'approve', hash: 'non-existing-hash' })
        .expect(404);
});

test('responds with 500 when reading the report file fails', () => {
    const server = createServer('/this/file/does/not/exist.json');
    const request = supertest(server);

    return request.patch('/api/results')
        .send({ op: 'approve', hash: 'any-result-hash' })
        .expect(500);
});
