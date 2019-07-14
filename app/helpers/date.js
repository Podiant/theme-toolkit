var moment = require('moment');

module.exports = function date(value, format) {
    return moment(value).format(format);
};
