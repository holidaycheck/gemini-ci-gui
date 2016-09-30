import React from 'react';
import Drawer from 'material-ui/Drawer';
import { spacing, typography } from 'material-ui/styles';
import { cyan500, blue500, lightGreen500, red500 } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import AssessmentIcon from 'material-ui/svg-icons/action/assessment';
import R from 'ramda';
import DoneIcon from 'material-ui/svg-icons/action/done';
import ErrorIcon from 'material-ui/svg-icons/alert/error';

import SelectableList from './SelectableList.jsx';
import MetricsIndicator from './MetricsIndicator.jsx';
import { resultsType } from '../propTypes';
import resultsToSuiteTree from '../lib/resultsToSuiteTree';

const styles = {
    navTitle: {
        fontSize: 18,
        color: typography.textFullWhite,
        lineHeight: `${spacing.desktopKeylineIncrement}px`,
        fontWeight: typography.fontWeightLight,
        backgroundColor: cyan500,
        paddingLeft: spacing.desktopGutter,
        margin: 0,
        marginBottom: 8
    }
};

function renderBrowser([ browserName, browser ]) {
    let icon;

    if (browser.type === 'success') {
        icon = <DoneIcon color={lightGreen500} />;
    } else {
        icon = <ErrorIcon color={red500} />;
    }

    return <ListItem
        primaryText={browserName}
        value={browser.hash}
        rightIcon={icon}
    />;
}

function renderState([ stateName, state ]) {
    const browsers = R.toPairs(state.browsers);
    const subItems = browsers.map(renderBrowser);

    return <ListItem
        primaryText={stateName}
        primaryTogglesNestedList
        secondaryText={<MetricsIndicator suite={state} />}
        nestedItems={subItems}
    />;
}

function renderSuite(suite) {
    const states = R.toPairs(suite.states);
    const childSuites = suite.children || {};

    return [
        ...states.map(renderState),
        ...(R.keys(childSuites).length > 0 ? [ <Divider inset /> ] : []),
        // eslint-disable-next-line no-use-before-define
        ...renderSuiteNavTree(childSuites)
    ];
}

function renderSuiteNavTree(suiteTree) {
    const topLevelSuites = R.toPairs(suiteTree);

    return topLevelSuites.map(function ([ suiteName, suite ]) {
        const subItems = renderSuite(suite);

        return <ListItem
            primaryText={suiteName}
            secondaryText={<MetricsIndicator suite={suite} />}
            primaryTogglesNestedList
            nestedItems={subItems}
        />;
    });
}

export default class Navigation extends React.Component {
    render() {
        const suiteTree = resultsToSuiteTree(this.props.results);

        const items = [
            <ListItem value='summary' primaryText='Summary' leftIcon={<AssessmentIcon color={blue500} />} />,
            <Divider />,
            ...renderSuiteNavTree(suiteTree)
        ];

        return (
            <Drawer docked>
                <h2 style={styles.navTitle}>Results</h2>
                <SelectableList value={this.props.selectedValue} onChange={this.props.onChange} children={items} />
            </Drawer>
        );
    }
}

Navigation.propTypes = {
    results: resultsType.isRequired,
    onChange: React.PropTypes.func.isRequired,
    selectedValue: React.PropTypes.string.isRequired
};
