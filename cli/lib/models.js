const _ = require('underscore');
const AdapterBase = require('./adapters');
const ValidationException = require('../exceptions/validation');

module.exports = class ModelBase {
    constructor(type, data, options) {
        this._type = type;
        this._data = data;

        if (typeof (options) === 'object' && options !== null) {
            if (typeof (options.adapter !== 'undefined')) {
                this.adapter = options.adapter;
            }
        }

        if (typeof(this.adapter) === 'undefined') {
            this.adapter = new AdapterBase();
        }
    }

    serialise() {
        const data = _.clone(this._data);
        let serialised = {
            type: this._type
        };

        if (data.id) {
            serialised.id = data.id;
            delete data.id;
        }

        serialised.attributes = data;
        return serialised;
    }

    async save() {
        const serialised = this.serialise();

        try {
            if (serialised.id) {
                return await this.adapter.put(serialised);
            } else {
                return await this.adapter.post(serialised);
            }
        } catch (err) {
            if (err.status === 422) {
                throw new ValidationException(err.detail, err.meta);
            }

            throw err;
        }
    }
};
