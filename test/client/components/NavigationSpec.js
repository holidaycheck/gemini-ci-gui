import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import { ListItem } from 'material-ui/List';
import DoneIcon from 'material-ui/svg-icons/action/done';
import ErrorIcon from 'material-ui/svg-icons/alert/error';
import sinon from 'sinon';

import SelectableList from '../../../client/components/SelectableList.jsx';
import Navigation from '../../../client/components/Navigation.jsx';
import MetricsIndicator from '../../../client/components/MetricsIndicator.jsx';

const noop = () => {};

function createResult(suitePath, type = 'success') {
    return {
        hash: 'any-hash',
        type,
        suitePath,
        stateName: 'plain',
        browserId: 'firefox'
    };
}

test('renders a docked Drawer with correct title', (t) => {
    const navigation = shallow(<Navigation results={[]} onChange={noop} selectedValue='foo' />);

    t.is(navigation.type(), Drawer);
    t.is(navigation.find('h2').text(), 'Results');
});

test('renders a SelectableList with the given selected value', (t) => {
    const navigation = shallow(<Navigation results={[]} onChange={noop} selectedValue='foo' />);
    const list = navigation.find(SelectableList);

    t.false(list.isEmpty());
    t.is(list.prop('value'), 'foo');
});

test('calls the onChange event handler when the selection changes', (t) => {
    const onSelect = sinon.stub();
    const navigation = shallow(<Navigation results={[]} onChange={onSelect} selectedValue='foo' />);
    const list = navigation.find(SelectableList);

    list.simulate('change');

    t.true(onSelect.calledOnce);
});

test('renders the Summary link as the first ListItem', (t) => {
    const results = [ createResult([ 'foo' ]) ];
    const navigation = shallow(<Navigation results={results} onChange={noop} selectedValue='foo' />);
    const items = navigation.find(ListItem);

    t.is(items.first().prop('primaryText'), 'Summary');
    t.is(items.first().prop('value'), 'summary');
});

test('renders all top-level suites as ListItems', (t) => {
    const results = [ createResult([ 'suite-1' ]), createResult([ 'suite-2' ], 'error') ];
    const navigation = shallow(<Navigation results={results} onChange={noop} selectedValue='foo' />);
    const items = navigation.find(ListItem);

    t.is(items.length, 3);
    t.is(items.at(1).prop('primaryText'), 'suite-1');
    t.is(items.at(1).prop('secondaryText').type, MetricsIndicator);

    const state = items.at(1).prop('nestedItems')[0];
    t.is(state.type, ListItem);
    t.is(state.props.primaryText, 'plain');
    t.is(state.props.secondaryText.type, MetricsIndicator);

    const browser = state.props.nestedItems[0];
    t.is(browser.type, ListItem);
    t.is(browser.props.primaryText, 'firefox');
    t.is(browser.props.value, 'any-hash');
    t.is(browser.props.rightIcon.type, DoneIcon);

    t.is(items.at(2).prop('primaryText'), 'suite-2');
    t.is(items.at(2).prop('secondaryText').type, MetricsIndicator);

    const secondSuiteBrowser = items.at(2).prop('nestedItems')[0].props.nestedItems[0];
    t.is(secondSuiteBrowser.props.rightIcon.type, ErrorIcon);
});

test('renders nested suites', (t) => {
    const results = [ createResult([ 'foo' ]), createResult([ 'foo', 'bar' ]) ];
    const navigation = shallow(<Navigation results={results} onChange={noop} selectedValue='' />);
    const items = navigation.find(ListItem);

    t.is(items.length, 2);
    t.is(items.at(1).prop('nestedItems')[1].type, Divider);

    const child = items.at(1).prop('nestedItems')[2];
    t.is(child.type, ListItem);
    t.is(child.props.primaryText, 'bar');
    t.is(child.props.nestedItems.length, 1);
});
