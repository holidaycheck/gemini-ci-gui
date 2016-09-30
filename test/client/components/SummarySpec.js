import test from 'ava';
import { shallow } from 'enzyme';
import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Pie as PieChart } from 'react-chartjs';
import { redA700, redA200, lightGreen500 } from 'material-ui/styles/colors';

import Summary from '../../../client/components/Summary.jsx';

function createResultOfType(type) {
    return {
        type,
        hash: 'foo',
        suitePath: [ 'foo' ],
        stateName: 'plain',
        browserId: 'firefox'
    };
}

const results = [
    createResultOfType('success'),
    createResultOfType('success'),
    createResultOfType('success'),
    createResultOfType('failure'),
    createResultOfType('failure'),
    createResultOfType('error')
];

test('renders a card with correct title', (t) => {
    const summary = shallow(<Summary results={results} />);
    const header = summary.find(CardHeader);

    t.false(summary.find(Card).isEmpty());
    t.is(header.prop('title'), 'Summary');
});

test('renders a text summary', (t) => {
    const summary = shallow(<Summary results={results} />);
    const cardText = summary.find(CardText);
    const text = cardText.children().map((child) => child.text()).join('');

    t.regex(text, /Total number of tests: 6/);
    t.regex(text, /Passed: 3/);
    t.regex(text, /Failed: 2/);
    t.regex(text, /Errors: 1/);
});

test('renders a pie chart', (t) => {
    const summary = shallow(<Summary results={results} />);
    const chart = summary.find(PieChart);
    const expectedChartData = [
        { color: lightGreen500, label: 'Passed', value: 3 },
        { color: redA200, label: 'Failed', value: 2 },
        { color: redA700, label: 'Errors', value: 1 }
    ];

    t.false(chart.isEmpty());
    t.deepEqual(chart.prop('data'), expectedChartData);
});
