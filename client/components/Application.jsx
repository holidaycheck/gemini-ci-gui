import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import R from 'ramda';

import Navigation from './Navigation.jsx';
import Result from './Result.jsx';
import Summary from './Summary.jsx';
import Notification from './Notification.jsx';
import { resultsType } from '../propTypes';

function sendUpdateOperation(win, operation, hash) {
    const headers = { 'Content-Type': 'application/json' };
    const payload = { op: operation, hash };
    const body = JSON.stringify(payload);

    return win.fetch('/api/results', { method: 'PATCH', headers, body })
        .then((response) => {
            if (response.status !== 200) {
                const error = new Error('Response not OK');

                error.status = response.status;

                throw error;
            }

            return response.json();
        });
}

const styles = {
    title: {
        textAlign: 'center'
    },
    content: {
        paddingLeft: '256px',
        margin: '30px'
    }
};

export default class Application extends React.Component {
    constructor(props, ...rest) {
        super(props, ...rest);

        this.state = {
            selectedNavItem: 'summary',
            results: props.results,
            lastMessage: null
        };

        this.updateNavItem = this.updateNavItem.bind(this);
        this.approve = this.updateResultsOnServer.bind(this, 'approve');
        this.addAsReference = this.updateResultsOnServer.bind(this, 'add-as-reference');
        this.hideNotification = this.hideNotification.bind(this);
    }

    updateNavItem(event, value) {
        this.hideNotification();
        this.setState({ selectedNavItem: value });
    }

    updateResultsOnServer(operation, hash) {
        sendUpdateOperation(this.props.window, operation, hash)
            .then(({ results, newHash }) => {
                this.setState({
                    results,
                    selectedNavItem: newHash,
                    lastMessage: {
                        error: false,
                        open: true,
                        message: 'Result successfully updated.'
                    }
                });
            })
            .catch(({ status }) => {
                let message;

                if (status === 404) {
                    message = 'Result doesn’t exist anymore, refresh the page to see the new results.';
                } else {
                    message = 'Something went wrong.';
                }

                this.setState({ lastMessage: { error: true, open: true, message } });
            });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ results: nextProps.results });
    }

    hideNotification() {
        const { lastMessage } = this.state;

        if (lastMessage && lastMessage.open) {
            this.setState(R.assocPath([ 'lastMessage', 'open' ], false, this.state));
        }
    }

    renderNotification() {
        const { lastMessage } = this.state;

        if (lastMessage) {
            return <Notification
                onClose={this.hideNotification}
                open={lastMessage.open}
                message={lastMessage.message}
                error={lastMessage.error}
            />;
        }

        return null;
    }

    renderContent() {
        const { selectedNavItem, results } = this.state;
        const selectedResult = R.find(R.whereEq({ hash: selectedNavItem }), results);

        if (selectedResult) {
            return <Result
                result={selectedResult}
                key={selectedResult.hash}
                onApprove={this.approve}
                onReferenceAccept={this.addAsReference}
            />;
        }

        return <Summary results={results} />;
    }

    render() {
        const { selectedNavItem, results } = this.state;
        const title = 'Gemini CI GUI';

        return (
            <MuiThemeProvider>
                <div>
                    <AppBar titleStyle={styles.title} title={title} showMenuIconButton={false} />
                    <Navigation results={results} onChange={this.updateNavItem} selectedValue={selectedNavItem} />
                    <div style={styles.content}>{this.renderContent()}</div>
                    { this.renderNotification() }
                </div>
            </MuiThemeProvider>
        );
    }
}

Application.propTypes = {
    results: resultsType,
    window: React.PropTypes.object.isRequired
};
