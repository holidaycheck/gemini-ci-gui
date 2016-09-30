import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import { lightGreen500, red500 } from 'material-ui/styles/colors';

import collectMetrics from '../lib/collectMetrics';
import { suiteType } from '../propTypes';

const styles = {
    container: {
        marginTop: '8px'
    },
    progressBar: {
        marginRight: '6px',
        height: '4px',
        maxWidth: '75%',
        backgroundColor: red500,
        display: 'inline-block'
    },
    label: {
        fontSize: '10px'
    }
};

export default function MetricsIndicator(props) {
    const { passed, total } = collectMetrics(props.suite);
    const label = `${passed} / ${total}`;

    return (
        <div style={styles.container}>
            <LinearProgress
                mode='determinate'
                max={total}
                value={passed}
                color={lightGreen500}
                style={styles.progressBar}
            />
            <small style={styles.label}>{label}</small>
        </div>
    );
}

MetricsIndicator.propTypes = { suite: suiteType.isRequired };
