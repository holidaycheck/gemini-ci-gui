import 'sinon-as-promised';

import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import AppBar from 'material-ui/AppBar';

import Navigation from '../../../client/components/Navigation.jsx';
import Summary from '../../../client/components/Summary.jsx';
import Result from '../../../client/components/Result.jsx';
import Notification from '../../../client/components/Notification.jsx';
import Application from '../../../client/components/Application.jsx';

const results = [
    {
        hash: 'any-hash',
        type: 'failure',
        suitePath: [ 'foo' ],
        stateName: 'plain',
        browserId: 'firefox'
    }
];

test('renders AppBar with correct title', (t) => {
    const app = shallow(<Application results={results} window={{}} />);
    const appBar = app.find(AppBar);

    t.false(appBar.isEmpty());
    t.is(appBar.prop('title'), 'Gemini CI GUI');
});

test('renders Navigation', (t) => {
    const app = shallow(<Application results={results} window={{}} />);
    const nav = app.find(Navigation);

    t.false(nav.isEmpty());
    t.is(nav.prop('selectedValue'), 'summary');
});

test('renders Summary per default', (t) => {
    const app = shallow(<Application results={results} window={{}} />);
    const summary = app.find(Summary);

    t.false(summary.isEmpty());
    t.deepEqual(summary.prop('results'), results);
});

test('changes the selected nav item when navigation change is triggered', (t) => {
    const app = shallow(<Application results={results} window={{}} />);
    const nav = app.find(Navigation);

    t.is(nav.prop('selectedValue'), 'summary');

    nav.simulate('change', null, 'foo');

    t.is(app.find(Navigation).prop('selectedValue'), 'foo');
});

test('changes the content when navigation change is triggered', (t) => {
    const app = shallow(<Application results={results} window={{}} />);
    const nav = app.find(Navigation);

    t.false(app.find(Summary).isEmpty());

    nav.simulate('change', null, 'any-hash');

    t.true(app.find(Summary).isEmpty());

    const result = app.find(Result);
    t.false(result.isEmpty());
    t.deepEqual(result.prop('result'), results[0]);
});

test.cb('updates results and shows success notification when current result gets approved', (t) => {
    const fetch = sinon.stub();
    const app = shallow(<Application results={results} window={{ fetch }}/>);
    const newResult = {
        hash: 'new-hash',
        type: 'success',
        suitePath: [ 'bar' ],
        stateName: 'plain',
        browserId: 'firefox'
    };
    const json = { results: [ newResult ], newHash: 'new-hash' };
    const response = {
        json: sinon.stub().resolves(json),
        status: 200
    };
    fetch.resolves(response);

    app.find(Navigation).simulate('change', null, 'any-hash');

    t.is(app.find(Result).prop('result').hash, 'any-hash');

    app.find(Result).simulate('approve', 'any-hash');

    setTimeout(() => {
        app.update();

        t.is(app.find(Result).prop('result').hash, 'new-hash');
        t.is(app.find(Navigation).prop('selectedValue'), 'new-hash');

        const notification = app.find(Notification);

        t.false(notification.isEmpty());
        t.is(notification.prop('message'), 'Result successfully updated.');
        t.is(notification.prop('open'), true);
        t.is(notification.prop('error'), false);

        t.end();
    }, 10);
});

test.cb('updates results and shows success notification when current result gets added as reference', (t) => {
    const fetch = sinon.stub();
    const app = shallow(<Application results={results} window={{ fetch }}/>);
    const newResult = {
        hash: 'new-hash',
        type: 'success',
        suitePath: [ 'bar' ],
        stateName: 'plain',
        browserId: 'firefox'
    };
    const json = { results: [ newResult ], newHash: 'new-hash' };
    const response = {
        json: sinon.stub().resolves(json),
        status: 200
    };
    fetch.resolves(response);

    app.find(Navigation).simulate('change', null, 'any-hash');

    t.is(app.find(Result).prop('result').hash, 'any-hash');

    app.find(Result).simulate('referenceAccept', 'any-hash');

    setTimeout(() => {
        app.update();

        t.is(app.find(Result).prop('result').hash, 'new-hash');
        t.is(app.find(Navigation).prop('selectedValue'), 'new-hash');

        const notification = app.find(Notification);

        t.false(notification.isEmpty());
        t.is(notification.prop('message'), 'Result successfully updated.');
        t.is(notification.prop('open'), true);
        t.is(notification.prop('error'), false);

        t.end();
    }, 10);
});

test.cb('shows out-of-date error when receiving a 404 response from server', (t) => {
    const fetch = sinon.stub();
    const app = shallow(<Application results={results} window={{ fetch }}/>);
    const response = { status: 404 };
    fetch.resolves(response);

    app.find(Navigation).simulate('change', null, 'any-hash');

    t.is(app.find(Result).prop('result').hash, 'any-hash');

    app.find(Result).simulate('referenceAccept', 'any-hash');

    setTimeout(() => {
        app.update();

        const notification = app.find(Notification);

        t.false(notification.isEmpty());
        t.is(notification.prop('message'), 'Result doesn’t exist anymore, refresh the page to see the new results.');
        t.is(notification.prop('open'), true);
        t.is(notification.prop('error'), true);

        t.end();
    }, 10);
});

test.cb('shows generic error notification when response status is not 200 nor 404', (t) => {
    const fetch = sinon.stub();
    const app = shallow(<Application results={results} window={{ fetch }}/>);
    const response = { status: 418 };
    fetch.resolves(response);

    app.find(Navigation).simulate('change', null, 'any-hash');

    t.is(app.find(Result).prop('result').hash, 'any-hash');

    app.find(Result).simulate('referenceAccept', 'any-hash');

    setTimeout(() => {
        app.update();

        const notification = app.find(Notification);

        t.false(notification.isEmpty());
        t.is(notification.prop('message'), 'Something went wrong.');
        t.is(notification.prop('open'), true);
        t.is(notification.prop('error'), true);

        t.end();
    }, 10);
});

test.cb('shows generic error notification when fetch rejects the promise', (t) => {
    const fetch = sinon.stub();
    const app = shallow(<Application results={results} window={{ fetch }}/>);
    fetch.rejects(new Error());

    app.find(Navigation).simulate('change', null, 'any-hash');

    t.is(app.find(Result).prop('result').hash, 'any-hash');

    app.find(Result).simulate('referenceAccept', 'any-hash');

    setTimeout(() => {
        app.update();

        const notification = app.find(Notification);

        t.false(notification.isEmpty());
        t.is(notification.prop('message'), 'Something went wrong.');
        t.is(notification.prop('open'), true);
        t.is(notification.prop('error'), true);

        t.end();
    }, 10);
});

test('renders new results when receiving new props', (t) => {
    const app = shallow(<Application results={results} window={{}}/>);

    t.deepEqual(app.find(Summary).prop('results'), results);

    app.setProps({ results: [], window: {} });

    t.deepEqual(app.find(Summary).prop('results'), []);
});
