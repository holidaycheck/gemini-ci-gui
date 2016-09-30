import test from 'ava';
import { shallow } from 'enzyme';
import React from 'react';
import DoneIcon from 'material-ui/svg-icons/action/done';
import ErrorIcon from 'material-ui/svg-icons/alert/error';
import { red500, lightGreen500 } from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';

import Notification from '../../../client/components/Notification.jsx';

const noop = () => {};

test('renders a Snackbar with error indicator', (t) => {
    const notification = shallow(<Notification open={false} error={true} message='foo' onClose={noop} />);
    const snackbar = notification.find(Snackbar);

    t.false(snackbar.isEmpty());
    t.false(snackbar.prop('open'));

    const message = snackbar.prop('message');

    t.is(message[0].type, ErrorIcon);
    t.is(message[0].props.color, red500);
    t.is(message[1], 'foo');
});

test('renders a Snackbar with success indicator', (t) => {
    const notification = shallow(<Notification open error={false} message='foo' onClose={noop} />);
    const snackbar = notification.find(Snackbar);

    t.false(snackbar.isEmpty());
    t.true(snackbar.prop('open'));

    const message = snackbar.prop('message');

    t.is(message[0].type, DoneIcon);
    t.is(message[0].props.color, lightGreen500);
    t.is(message[1], 'foo');
});
