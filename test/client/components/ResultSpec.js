import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';

import FailureResult from '../../../client/components/FailureResult.jsx';
import SuccessResult from '../../../client/components/SuccessResult.jsx';
import ErrorResult from '../../../client/components/ErrorResult.jsx';
import NoReferenceResult from '../../../client/components/NoReferenceResult.jsx';
import Result from '../../../client/components/Result.jsx';

const noop = () => {};

function createResultOfType(type, errorName) {
    let error;

    if (errorName) {
        error = { name: errorName, message: '' };
    }

    return {
        type,
        hash: 'foo',
        suitePath: [ 'foo', 'bar' ],
        stateName: 'plain',
        browserId: 'firefox',
        error
    };
}

function render(result) {
    return shallow(<Result result={result} onReferenceAccept={noop} onApprove={noop} />);
}

test('renders a FailureResult component when the result type is failure', (t) => {
    const result = render(createResultOfType('failure'));
    const failureResult = result.find(FailureResult);

    t.false(failureResult.isEmpty());
    t.is(failureResult.prop('title'), 'foo - bar: plain - firefox');
    t.is(failureResult.prop('onApprove'), noop);
});

test('renders a SuccessResult component when the result type is success', (t) => {
    const result = render(createResultOfType('success'));
    const successResult = result.find(SuccessResult);

    t.false(successResult.isEmpty());
    t.is(successResult.prop('title'), 'foo - bar: plain - firefox');
});

test('renders a NoReferenceResult component when the result type is error and error.name is NoRefImageError', (t) => {
    const result = render(createResultOfType('error', 'NoRefImageError'));
    const errorResult = result.find(NoReferenceResult);

    t.false(errorResult.isEmpty());
    t.is(errorResult.prop('title'), 'foo - bar: plain - firefox');
    t.is(errorResult.prop('onReferenceAccept'), noop);
});

test('renders an ErrorResult component when the result type is error and error.name is not NoRefImageError', (t) => {
    const result = render(createResultOfType('error', 'OtherError'));
    const errorResult = result.find(ErrorResult);

    t.false(errorResult.isEmpty());
    t.is(errorResult.prop('title'), 'foo - bar: plain - firefox');
});
