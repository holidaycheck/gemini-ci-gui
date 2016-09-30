import test from 'ava';

import mapResultsToTree from '../../../client/lib/resultsToSuiteTree';

test('maps a single result', (t) => {
    const results = [ {
        suitePath: [ 'foo' ],
        stateName: 'bar',
        browserId: 'mosaic',
        additional: 'data'
    } ];

    const expectedTree = {
        foo: { states: { bar: { browsers: { mosaic: results[0] } } } }
    };

    t.deepEqual(mapResultsToTree(results), expectedTree);
});

test('maps results for one suite but multiple browsers', (t) => {
    const results = [
        {
            suitePath: [ 'foo' ],
            stateName: 'anyState',
            browserId: 'mosaic',
            additional: 'data 1'
        },
        {
            suitePath: [ 'foo' ],
            stateName: 'anyState',
            browserId: 'lynx',
            additional: 'data 2'
        }
    ];

    const expectedTree = {
        foo: {
            states: {
                anyState: {
                    browsers: {
                        mosaic: results[0],
                        lynx: results[1]
                    }
                }
            }
        }
    };

    t.deepEqual(mapResultsToTree(results), expectedTree);
});

test('maps results for one suite but multiple states', (t) => {
    const results = [
        {
            suitePath: [ 'foo' ],
            stateName: 'firstState',
            browserId: 'mosaic',
            additional: 'data 1'
        },
        {
            suitePath: [ 'foo' ],
            stateName: 'secondState',
            browserId: 'mosaic',
            additional: 'data 2'
        }
    ];

    const expectedTree = {
        foo: {
            states: {
                firstState: {
                    browsers: {
                        mosaic: results[0]
                    }
                },
                secondState: {
                    browsers: {
                        mosaic: results[1]
                    }
                }
            }
        }
    };

    t.deepEqual(mapResultsToTree(results), expectedTree);
});

test('maps multiple nested results', (t) => {
    const results = [
        {
            suitePath: [ 'first' ],
            stateName: [ 'anyState' ],
            browserId: 'mosaic',
            additional: 'data 1'
        },
        {
            suitePath: [ 'first', 'second' ],
            stateName: [ 'anyState' ],
            browserId: 'mosaic',
            additional: 'data 2'
        },
        {
            suitePath: [ 'first', 'second', 'third' ],
            stateName: [ 'anyState' ],
            browserId: 'mosaic',
            additional: 'data 3'
        }
    ];

    const expectedTree = {
        first: {
            children: {
                second: {
                    children: {
                        third: {
                            states: {
                                anyState: {
                                    browsers: {
                                        mosaic: results[2]
                                    }
                                }
                            }
                        }
                    },
                    states: {
                        anyState: {
                            browsers: {
                                mosaic: results[1]
                            }
                        }
                    }
                }
            },
            states: {
                anyState: {
                    browsers: {
                        mosaic: results[0]
                    }
                }
            }
        }
    };

    t.deepEqual(mapResultsToTree(results), expectedTree);
});

test('maps multiple adjacent results', (t) => {
    const results = [
        {
            suitePath: [ 'first' ],
            stateName: [ 'anyState' ],
            browserId: 'mosaic',
            additional: 'data 1'
        },
        {
            suitePath: [ 'second' ],
            stateName: [ 'anyState' ],
            browserId: 'mosaic',
            additional: 'data 2'
        }
    ];

    const expectedTree = {
        first: {
            states: {
                anyState: {
                    browsers: {
                        mosaic: results[0]
                    }
                }
            }
        },
        second: {
            states: {
                anyState: {
                    browsers: {
                        mosaic: results[1]
                    }
                }
            }
        }
    };

    t.deepEqual(mapResultsToTree(results), expectedTree);
});
