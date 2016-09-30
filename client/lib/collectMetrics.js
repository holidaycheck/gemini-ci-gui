import R from 'ramda';

const isLeaf = R.has('type');

function findAllResultTypes(node) {
    if (isLeaf(node)) {
        return node.type;
    }
    return R.flatten(R.map(findAllResultTypes, R.values(node)));
}

export default function collectMetrics(node) {
    const resultTypes = findAllResultTypes(node);
    const typeCounts = R.countBy(R.identity, resultTypes);

    return {
        total: resultTypes.length,
        passed: typeCounts.success || 0
    };
}

