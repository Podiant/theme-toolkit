module.exports = function tokenize(value, token, replacement) {
    var exStr = new RegExp('@' + token, 'g');

    if(value) {
        return value.replace(exStr, replacement);
    }
};
