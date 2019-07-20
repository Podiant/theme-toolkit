module.exports = class Exception extends Error {
    constructor(options) {
        super();
        Object.keys(options).forEach(
            (key) => {
                this[key] = options[key]
            }
        );

        this.constructor = Exception;
        this.__proto__ = Exception.prototype;
    }
}
