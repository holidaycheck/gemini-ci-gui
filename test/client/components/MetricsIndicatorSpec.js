import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import LinearProgress from 'material-ui/LinearProgress';

import MetricsIndicator from '../../../client/components/MetricsIndicator.jsx';

const suiteTree = {
    states: {
        plain: {
            browsers: {
                firefox: {
                    type: 'success',
                    hash: 'hash-1',
                    suitePath: [ 'foo' ],
                    browserId: 'firefox',
                    stateName: 'plain'
                }
            }
        }
    },
    children: {
        bar: {
            states: {
                plain: {
                    browsers: {
                        firefox: {
                            type: 'error',
                            hash: 'hash-2',
                            suitePath: [ 'foo', 'bar' ],
                            browserId: 'firefox',
                            stateName: 'plain'
                        }
                    }
                }
            }
        }
    }
};

test('renders a LinearProgress bar', (t) => {
    const indicator = shallow(<MetricsIndicator suite={suiteTree} />);
    const progressBar = indicator.find(LinearProgress);

    t.false(progressBar.isEmpty());
    t.is(progressBar.prop('mode'), 'determinate');
});

test('sets the correct values of the progress bar', (t) => {
    const indicator = shallow(<MetricsIndicator suite={suiteTree} />);
    const progressBar = indicator.find(LinearProgress);

    t.is(progressBar.prop('value'), 1);
    t.is(progressBar.prop('max'), 2);
});

test('renders a text label', (t) => {
    const indicator = shallow(<MetricsIndicator suite={suiteTree} />);
    const label = indicator.find('small');

    t.is(label.text(), '1 / 2');
});
