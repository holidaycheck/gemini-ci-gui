import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import { Card, CardHeader } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import sinon from 'sinon';
import { Tab } from 'material-ui/Tabs';

import FailureResult from '../../../client/components/FailureResult.jsx';

const defaultErrorResult = {
    hash: 'foo',
    type: 'failure',
    suitePath: [ 'foo' ],
    browserId: 'firefox',
    stateName: 'plain',
    images: {
        actual: '/images/foo/actual',
        diff: '/images/foo/diff',
        reference: '/images/foo/reference'
    }
};

const noop = () => {};

test('renders a card with the given title', (t) => {
    const result = shallow(<FailureResult title='any title' result={defaultErrorResult} onApprove={noop} />);
    const header = result.find(CardHeader);

    t.is(result.type(), Card);
    t.is(header.prop('title'), 'any title');
    t.is(header.prop('subtitle'), 'Failure: the actual screenshot doesn’t match the reference screenshot.');
});

test('renders tabs for each image', (t) => {
    const result = shallow(<FailureResult title='any title' result={defaultErrorResult} onApprove={noop} />);
    const tabs = result.find(Tab);
    const actualTab = tabs.at(0);
    const referenceTab = tabs.at(1);
    const diffTab = tabs.at(2);

    t.is(tabs.children().length, 3);

    t.is(actualTab.prop('label'), 'Actual');
    t.is(actualTab.find('img').prop('src'), '/images/foo/actual');

    t.is(referenceTab.prop('label'), 'Reference');
    t.is(referenceTab.find('img').prop('src'), '/images/foo/reference');

    t.is(diffTab.prop('label'), 'Difference');
    t.is(diffTab.find('img').prop('src'), '/images/foo/diff');
});

test('renders an approve button', (t) => {
    const result = shallow(<FailureResult title='any title' result={defaultErrorResult} onApprove={noop} />);
    const button = result.find(RaisedButton);

    t.false(button.isEmpty());
    t.is(button.prop('label'), 'Approve Changes');
});

test('triggers an approve event when the button is clicked', (t) => {
    const onApprove = sinon.spy();
    const result = shallow(<FailureResult title='any title' result={defaultErrorResult} onApprove={onApprove} />);
    const button = result.find(RaisedButton);

    button.simulate('touchTap');

    t.true(onApprove.calledOnce);
    t.true(onApprove.calledWithExactly('foo'));
});
