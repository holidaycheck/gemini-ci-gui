import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import R from 'ramda';
import { Pie as PieChart } from 'react-chartjs';
import { redA700, redA200, lightGreen500 } from 'material-ui/styles/colors';

import { resultsType } from '../propTypes';

const propLength = (propName, object) => R.length(R.propOr([], propName, object));

export default class Summary extends React.Component {
    render() {
        const types = R.groupBy(R.prop('type'), this.props.results);
        const chartData = [
            {
                color: lightGreen500,
                label: 'Passed',
                value: propLength('success', types)
            },
            {

                color: redA200,
                label: 'Failed',
                value: propLength('failure', types)
            },
            {
                color: redA700,
                label: 'Errors',
                value: propLength('error', types)
            }
        ];

        return (
            <Card>
                <CardHeader title='Summary' />
                <CardText expandable={false}>
                    Total number of tests: {this.props.results.length}<br />
                    Passed: {propLength('success', types)}<br />
                    Failed: {propLength('failure', types)}<br />
                    Errors: {propLength('error', types)}<br />

                    <PieChart style={{ margin: 'auto', display: 'block' }} data={chartData} width='400' height='400' />
                </CardText>
            </Card>
        );
    }
}

Summary.propTypes = { results: resultsType };

