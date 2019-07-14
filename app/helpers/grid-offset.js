module.exports = function grid_offset(objectCount, gridSize, step, context) {
    var remainder = gridSize % objectCount;
    var output = '';

    if (typeof(context) === 'undefined') {
        context = step;
        step = 'whole';
    }

    if (!remainder & gridSize > objectCount) {
        remainder = gridSize - objectCount;
    }

    for (var i = 0; i < remainder; i ++) {
        output += context.fn(this);
    }

    return output;
};
