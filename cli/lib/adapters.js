const Request = require('./api');

module.exports = class AdapterBase {
    constructor(options) {
        this.authenticator = null;

        if (typeof(options) === 'object' && options !== null) {
            if (typeof(options.authenticator) !== 'undefined') {
                this.authenticator = options.authenticator;
            }
        }
    }

    async get() {
        throw await new Error('Method not implemented');
    }

    async put(data) {
        const request = new Request(
            `/${data.type}/${data.id}/`,
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
            `/${data.type}/`,
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
