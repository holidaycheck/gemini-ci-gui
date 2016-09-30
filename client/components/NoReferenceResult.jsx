import React from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { red500 } from 'material-ui/styles/colors';
import VisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import AddBoxIcon from 'material-ui/svg-icons/content/add-box';
import RaisedButton from 'material-ui/RaisedButton';

import { resultType } from '../propTypes';
import styles from '../styles/resultStyles';

export default class NoReferenceResult extends React.Component {
    constructor(...args) {
        super(...args);

        this.propagateAcceptEvent = this.propagateAcceptEvent.bind(this);
    }

    propagateAcceptEvent() {
        this.props.onReferenceAccept(this.props.result.hash);
    }

    render() {
        const { result, title } = this.props;
        const subtitle = 'Reference image does not exist for this test.';
        const headerIcon = <VisibilityOffIcon color={red500} />;

        return (
            <Card>
                <CardHeader avatar={headerIcon} subtitleColor={red500} subtitle={subtitle} title={title} />
                <CardActions style={styles.actions}>
                    <RaisedButton
                        label='Accept as Reference'
                        primary
                        icon={<AddBoxIcon />}
                        onTouchTap={this.propagateAcceptEvent}
                    />
                </CardActions>
                <CardText expandable={false} style={styles.imageContainer}>
                    <img style={styles.image} src={result.images.actual} />
                </CardText>
            </Card>
        );
    }
}

NoReferenceResult.propTypes = {
    title: React.PropTypes.string.isRequired,
    onReferenceAccept: React.PropTypes.func.isRequired,
    result: resultType.isRequired
};
