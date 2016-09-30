import React from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { red500 } from 'material-ui/styles/colors';
import FlipIcon from 'material-ui/svg-icons/image/flip';
import SaveIcon from 'material-ui/svg-icons/content/save';
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import R from 'ramda';

import { resultType } from '../propTypes';
import styles from '../styles/resultStyles';

function renderImageTab(label, src) {
    return <Tab label={label}><img style={styles.image} src={src} alt={label} /></Tab>;
}

export default class FailureResult extends React.Component {
    constructor(...args) {
        super(...args);

        this.propagateApproveEvent = this.propagateApproveEvent.bind(this);
    }

    propagateApproveEvent() {
        this.props.onApprove(this.props.result.hash);
    }

    render() {
        const { result, title } = this.props;
        const subtitle = 'Failure: the actual screenshot doesn’t match the reference screenshot.';
        const headerIcon = <FlipIcon color={red500} />;

        return (
            <Card>
                <CardHeader avatar={headerIcon} subtitleColor={red500} title={title} subtitle={subtitle} />
                <CardActions style={styles.actions}>
                     <RaisedButton
                        label='Approve Changes'
                        primary
                        icon={<SaveIcon />}
                        onTouchTap={this.propagateApproveEvent}
                    />
                </CardActions>
                <CardText expandable={false}>
                    <Tabs contentContainerStyle={R.merge(styles.tabContent, styles.imageContainer)}>
                        {renderImageTab('Actual', result.images.actual)}
                        {renderImageTab('Reference', result.images.reference)}
                        {renderImageTab('Difference', result.images.diff)}
                    </Tabs>
                </CardText>
            </Card>
        );
    }
}

FailureResult.propTypes = {
    title: React.PropTypes.string.isRequired,
    onApprove: React.PropTypes.func.isRequired,
    result: resultType
};
