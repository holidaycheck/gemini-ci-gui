import React from 'react';

export const resultType = React.PropTypes.shape({
    hash: React.PropTypes.string.isRequired,
    type: React.PropTypes.oneOf([ 'success', 'error', 'failure' ]).isRequired,
    suitePath: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    browserId: React.PropTypes.string.isRequired,
    stateName: React.PropTypes.string.isRequired,
    equal: React.PropTypes.bool,
    error: React.PropTypes.shape({
        message: React.PropTypes.string.isRequired,
        stack: React.PropTypes.string
    }),
    images: React.PropTypes.shape({
        reference: React.PropTypes.string.isRequired,
        actual: React.PropTypes.string,
        diff: React.PropTypes.string
    })
});

export const resultsType = React.PropTypes.arrayOf(resultType);

const stateType = React.PropTypes.shape({
    browsers: React.PropTypes.objectOf(resultType).isRequired
});

const suiteShape = { states: React.PropTypes.objectOf(stateType).isRequired };

suiteShape.children = React.PropTypes.objectOf(React.PropTypes.shape(suiteShape));

export const suiteType = React.PropTypes.oneOfType([
    React.PropTypes.shape(suiteShape),
    stateType
]);
