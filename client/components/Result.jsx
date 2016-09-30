import React from 'react';

import FailureResult from './FailureResult.jsx';
import SuccessResult from './SuccessResult.jsx';
import ErrorResult from './ErrorResult.jsx';
import NoReferenceResult from './NoReferenceResult.jsx';
import { resultType } from '../propTypes';

export default class Result extends React.Component {
    render() {
        const { result, onApprove, onReferenceAccept } = this.props;
        const title = `${result.suitePath.join(' - ')}: ${result.stateName} - ${result.browserId}`;
        let content;

        if (result.type === 'failure') {
            content = <FailureResult title={title} result={result} onApprove={onApprove} />;
        } else if (result.type === 'success') {
            content = <SuccessResult title={title} result={result} />;
        } else if (result.error.name === 'NoRefImageError') {
            content = <NoReferenceResult title={title} result={result} onReferenceAccept={onReferenceAccept} />;
        } else {
            content = <ErrorResult title={title} result={result} />;
        }

        return content;
    }
}

Result.propTypes = {
    onReferenceAccept: React.PropTypes.func.isRequired,
    onApprove: React.PropTypes.func.isRequired,
    result: resultType
};
