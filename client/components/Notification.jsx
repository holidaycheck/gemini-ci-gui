import React from 'react';
import DoneIcon from 'material-ui/svg-icons/action/done';
import ErrorIcon from 'material-ui/svg-icons/alert/error';
import { red500, lightGreen500 } from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';

const styles = {
    icon: {
        margin: '0 8px 8px 0',
        verticalAlign: 'middle'
    }
};

function renderNotificationIcon(error) {
    const IconComponent = error ? ErrorIcon : DoneIcon;
    const color = error ? red500 : lightGreen500;

    return <IconComponent color={color} style={styles.icon} key='notification-icon' />;
}

export default function Notification(props) {
    const icon = renderNotificationIcon(props.error);

    return <Snackbar open={props.open} message={[ icon, props.message ]} onRequestClose={props.onClose} />;
}

Notification.propTypes = {
    open: React.PropTypes.bool.isRequired,
    error: React.PropTypes.bool.isRequired,
    message: React.PropTypes.string.isRequired,
    onClose: React.PropTypes.func.isRequired
};
