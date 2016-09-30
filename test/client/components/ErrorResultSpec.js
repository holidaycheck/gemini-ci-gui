import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import { Card, CardHeader } from 'material-ui/Card';

import ErrorResult from '../../../client/components/ErrorResult.jsx';

const defaultErrorResult = {
    hash: 'foo',
    type: 'error',
    suitePath: [ 'foo' ],
    browserId: 'firefox',
    stateName: 'plain',
    error: {
        message: 'something unexpected happened',
        stack: 'any stacktrace'
    }
};

test('renders a card with the given title', (t) => {
    const result = shallow(<ErrorResult title='any title' result={defaultErrorResult} />);
    const header = result.find(CardHeader);

    t.is(result.type(), Card);
    t.is(header.prop('title'), 'any title');
    t.is(header.prop('subtitle'), 'An error occured during the test-run.');
});

test('renders the error message and stacktrace', (t) => {
    const result = shallow(<ErrorResult title='any title' result={defaultErrorResult} />);
    const message = result.find('h3');
    const stacktrace = result.find('pre');

    t.is(message.text(), 'something unexpected happened');
    t.is(stacktrace.text(), 'any stacktrace');
});
