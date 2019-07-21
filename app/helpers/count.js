module.exports = function count(value) {
    if (Array.isArray(value)) {
        return value.length;
    }

    return null;
};
