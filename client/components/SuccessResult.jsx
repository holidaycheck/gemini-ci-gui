import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { lightGreen500 } from 'material-ui/styles/colors';
import DoneIcon from 'material-ui/svg-icons/action/done';

import styles from '../styles/resultStyles';
import { resultType } from '../propTypes';

export default class SuccessResult extends React.Component {
    render() {
        const { result, title } = this.props;
        const subtitle = 'Success: no visual changes detected.';
        const headerIcon = <DoneIcon color={lightGreen500} />;

        return (
            <Card>
                <CardHeader avatar={headerIcon} subtitleColor={lightGreen500} title={title} subtitle={subtitle} />
                <CardText expandable={false} style={styles.imageContainer}>
                    <img style={styles.image} src={result.images.reference} />
                </CardText>
            </Card>
        );
    }
}

SuccessResult.propTypes = {
    title: React.PropTypes.string.isRequired,
    result: resultType.isRequired
};
