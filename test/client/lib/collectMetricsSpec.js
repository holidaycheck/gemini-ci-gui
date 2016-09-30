import test from 'ava';

import collectMetrics from '../../../client/lib/collectMetrics';

test('collects total amount and amount of passed test for a single suite', (t) => {
    const suiteTree = { foo: { states: { plain: { browsers: { firefox: { type: 'success' } } } } } };
    const metrics = collectMetrics(suiteTree);

    t.is(metrics.total, 1);
    t.is(metrics.passed, 1);
});

test('collects total amount and amount of passed test for a single error suite', (t) => {
    const suiteTree = { foo: { states: { plain: { browsers: { firefox: { type: 'error' } } } } } };
    const metrics = collectMetrics(suiteTree);

    t.is(metrics.total, 1);
    t.is(metrics.passed, 0);
});

test('collects metrics for multiple adjacent suites', (t) => {
    const suiteTree = {
        foo: { states: { plain: { browsers: { firefox: { type: 'success' } } } } },
        bar: { states: { plain: { browsers: { firefox: { type: 'failure' } } } } },
        baz: { states: { plain: { browsers: { firefox: { type: 'error' } } } } }
    };
    const metrics = collectMetrics(suiteTree);

    t.is(metrics.total, 3);
    t.is(metrics.passed, 1);
});

test('collects metrics for multiple nested suites', (t) => {
    const suiteTree = {
        foo: {
            states: { plain: { browsers: { firefox: { type: 'success' } } } },
            children: {
                bar: {
                    states: { plain: { browsers: { firefox: { type: 'error' } } } },
                    children: {
                        baz: {
                            states: { plain: { browsers: { firefox: { type: 'success' } } } }
                        }
                    }
                }
            }
        }
    };
    const metrics = collectMetrics(suiteTree);

    t.is(metrics.total, 3);
    t.is(metrics.passed, 2);
});

test('collects metrics for multiple nested and adjacent suites', (t) => {
    const suiteTree = {
        foo: {
            states: { plain: { browsers: { firefox: { type: 'error' } } } },
            children: {
                bar: { plain: { states: { browsers: { firefox: { type: 'success' } } } } }
            }
        },
        bar: { states: { plain: { browsers: { firefox: { type: 'success' } } } } }
    };
    const metrics = collectMetrics(suiteTree);

    t.is(metrics.total, 3);
    t.is(metrics.passed, 2);
});

test('collects metrics for multiple states', (t) => {
    const suiteTree = {
        foo: {
            states: {
                stateA: { browsers: { firefox: { type: 'error' } } },
                stateB: { browsers: { firefox: { type: 'success' } } }
            }
        }
    };
    const metrics = collectMetrics(suiteTree);

    t.is(metrics.total, 2);
    t.is(metrics.passed, 1);
});

test('collects metrics for multiple browsers', (t) => {
    const suiteTree = {
        foo: {
            states: {
                plain: {
                    browsers: {
                        firefox: { type: 'success' },
                        chrome: { type: 'success' }
                    }
                }
            }
        }
    };
    const metrics = collectMetrics(suiteTree);

    t.is(metrics.total, 2);
    t.is(metrics.passed, 2);
});
