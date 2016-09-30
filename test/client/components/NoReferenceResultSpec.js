import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import { Card, CardHeader } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import sinon from 'sinon';

import NoReferenceResult from '../../../client/components/NoReferenceResult.jsx';

const defaultErrorResult = {
    hash: 'foo',
    type: 'error',
    suitePath: [ 'foo' ],
    browserId: 'firefox',
    stateName: 'plain',
    images: {
        actual: '/images/foo/actual',
        reference: '/images/foo/reference'
    },
    error: {
        name: 'NoRefImageError',
        message: 'No reference image found'
    }
};

const noop = () => {};

test('renders a card with the given title', (t) => {
    const result = shallow(
        <NoReferenceResult title='any title' result={defaultErrorResult} onReferenceAccept={noop} />
    );
    const header = result.find(CardHeader);

    t.is(result.type(), Card);
    t.is(header.prop('title'), 'any title');
    t.is(header.prop('subtitle'), 'Reference image does not exist for this test.');
});

test('renders the actual images', (t) => {
    const result = shallow(
        <NoReferenceResult title='any title' result={defaultErrorResult} onReferenceAccept={noop} />
    );
    const img = result.find('img');

    t.false(img.isEmpty());
    t.is(img.prop('src'), '/images/foo/actual');
});

test('renders an accept button', (t) => {
    const result = shallow(
        <NoReferenceResult title='any title' result={defaultErrorResult} onReferenceAccept={noop} />
    );
    const button = result.find(RaisedButton);

    t.false(button.isEmpty());
    t.is(button.prop('label'), 'Accept as Reference');
});

test('triggers an accept event when the button is clicked', (t) => {
    const onReferenceAccept = sinon.spy();
    const result = shallow(
        <NoReferenceResult title='any title' result={defaultErrorResult} onReferenceAccept={onReferenceAccept} />
    );
    const button = result.find(RaisedButton);

    button.simulate('touchTap');

    t.true(onReferenceAccept.calledOnce);
    t.true(onReferenceAccept.calledWithExactly('foo'));
});
