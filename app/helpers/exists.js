module.exports = function exists(value, context) {
    if(value === undefined || value === null) {
        return context.inverse(this);
    }

    if(Array.isArray(value)) {
        if(!value.length) {
            return context.inverse(this);
        }
    } else {
        if(!Object.keys(value).length) {
            return context.inverse(this);
        }
    }

    if(value) {
        return context.fn(this);
    }

    return context.inverse(this);
}
