import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import { Card, CardHeader } from 'material-ui/Card';

import SuccessResult from '../../../client/components/SuccessResult.jsx';

const defaultSuccessResult = {
    hash: 'foo',
    type: 'success',
    suitePath: [ 'foo' ],
    browserId: 'firefox',
    stateName: 'plain',
    images: {
        reference: '/images/foo/reference'
    }
};

test('renders a card with the given title', (t) => {
    const result = shallow(<SuccessResult title='any title' result={defaultSuccessResult} />);
    const header = result.find(CardHeader);

    t.is(result.type(), Card);
    t.is(header.prop('title'), 'any title');
    t.is(header.prop('subtitle'), 'Success: no visual changes detected.');
});

test('renders the reference images', (t) => {
    const result = shallow(<SuccessResult title='any title' result={defaultSuccessResult} />);
    const img = result.find('img');

    t.false(img.isEmpty());
    t.is(img.prop('src'), '/images/foo/reference');
});
