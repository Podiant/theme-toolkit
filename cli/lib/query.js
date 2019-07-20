const _ = require('underscore');

module.exports = (type, model) => {
    const klass = class QuerySet {
        constructor(options) {
            if (typeof(options) === 'undefined') {
                options = {};
            }

            this._options = options;
        }

        _clone (options) {
            const opts = _.extend({}, this._options, options);

            return new QuerySet(opts);
        }

        async load() {
            const obj = new model();
            const data = await obj.adapter.get(this._options);

            return _.map(
                data.data,
                (item) => {
                    const obj = new model(item.attributes);

                    obj.attr('id', item.id);
                    return obj;
                }
            );
        }

        filter(options) {
            const filter = (
                typeof(this._options.filter) === 'object' && this._options.filter !== null
            ) ? this._options.filter : {};

            return this._clone(
                {
                    filter: _.extend(
                        {},
                        filter,
                        options
                    )
                }
            );
        }

        page(number) {
            return this._clone(
                {
                    page: number
                }
            );
        }

        limit(number) {
            return this._clone(
                {
                    limit: limit
                }
            );
        }
    };

    return new klass();
}
