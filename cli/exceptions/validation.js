const Exception = require('../lib/errors');

module.exports = class ValidationException extends Exception {
    constructor(message, errors) {
        super(
            {
                title: 'Validation error',
                detail: message,
                errors: errors
            }
        );

        this.constructor = ValidationException
        this.__proto__ = ValidationException.prototype
    }
};
