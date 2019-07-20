const Request = require('./api');

module.exports = class AdapterBase {
    constructor(type, options) {
        this._type = type;
        this.authenticator = null;

        if (typeof(options) === 'object' && options !== null) {
            if (typeof(options.authenticator) !== 'undefined') {
                this.authenticator = options.authenticator;
            }
        }
    }

    async get(options) {
        const request = new Request(
            `/${this._type}/`,
            options,
            {
                authenticator: this.authenticator
            }
        );

        return await request.get();
    }

    async put(data) {
        const request = new Request(
            `/${this._type}/${data.id}/`,
            {},
            {
                authenticator: this.authenticator
            }
        );

        return await request.put(
            {
                data: data
            }
        );
    }

    async post(data) {
        const request = new Request(
            `/${this._type}/`,
            {},
            {
                authenticator: this.authenticator
            }
        );

        return await request.post(
            {
                data: data
            }
        );
    }

    async delete() {
        throw new Error('Method not implemented');
    }
};
