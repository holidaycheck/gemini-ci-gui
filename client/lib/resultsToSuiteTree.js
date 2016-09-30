import R from 'ramda';

export default function resultsToSuiteTree(results) {
    return results.reduce((tree, result) => {
        const treePath = R.intersperse('children', result.suitePath);

        treePath.push('states', result.stateName, 'browsers', result.browserId);

        return R.assocPath(treePath, result, tree);
    }, {});
}
