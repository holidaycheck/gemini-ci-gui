'use strict';

const createServer = require('../../server/createServer');
const supertest = require('supertest');
const test = require('ava');
const path = require('path');

test('serves bundle.js', () => {
    const server = createServer('', path.join(__dirname, './fixtures'));
    const request = supertest(server);

    return request.get('/bundle.js')
        .expect(200);
});
