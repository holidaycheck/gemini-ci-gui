import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { red500 } from 'material-ui/styles/colors';
import ErrorIcon from 'material-ui/svg-icons/alert/error';

import { resultType } from '../propTypes';

const styles = {
    stacktrace: {
        color: red500
    }
};

export default function ErrorResult(props) {
    const { result, title } = props;
    const subtitle = 'An error occured during the test-run.';
    const headerIcon = <ErrorIcon color={red500} />;

    return (
        <Card>
            <CardHeader avatar={headerIcon} subtitleColor={red500} subtitle={subtitle} title={title} />
            <CardText expandable={false}>
                <h3>{result.error.message}</h3>
                <pre style={styles.stacktrace}>{result.error.stack}</pre>
            </CardText>
        </Card>
    );
}

ErrorResult.propTypes = {
    title: React.PropTypes.string.isRequired,
    result: resultType.isRequired
};
