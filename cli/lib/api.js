const _ = require('underscore');
const request = require('request');
const Exception = require('./errors');

const method = (method, path, params, data, authenticator) => {
    const apiKey = process.env.PODIANT_API_KEY;
    const domain = process.env.PODIANT_DOMAIN || 'api.podiant.co';
    const proto = process.env.PODIANT_SSL === 'false' ? 'http' : 'https';
    const url = `${proto}://api.${domain}${path}`;

    let options = {
        url: url,
        method: method,
        qs: params,
        headers: {
            'Accepts': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
        },
        timeout: 5000
    };

    if (typeof(data) === 'object' && data !== null) {
        options.json = data;
    }

    return new Promise(
        (resolve, reject) => {
            const perform = () => {
                // console.debug(`${method} ${url}`)

                try {
                    request(
                        options,
                        (err, response, body) => {
                            if (typeof (err) !== 'undefined' && err !== null) {
                                reject(err);
                                return;
                            }

                            if (response.statusCode >= 400) {
                                if (body.error) {
                                    reject(new Exception(body.error));
                                    return;
                                }

                                reject(
                                    new Exception(
                                        {
                                            title: 'Unknown API error'
                                        }
                                    )
                                );

                                return;
                            }

                            resolve(body);
                        }
                    );
                } catch (err) {
                    reject(new Exception(err));
                };
            }

            if (typeof(authenticator) === 'object' && authenticator !== null) {
                authenticator.authenticate(options).then(
                    (authOptions) => {
                        options = _.extend(options, authOptions);
                        perform();
                    }
                ).catch(
                    (err) => {
                        reject(new Exception(err));
                    }
                )
            } else {
                perform();
            }
        }
    );
};

module.exports = class Request {
    constructor(path, params, {authenticator}) {
        this.path = path
        this.params = typeof (params) === 'object' ? _.clone(params) : {};

        if (typeof (authenticator) !== 'undefined') {
            this.authenticator = authenticator;
        } else {
            this.authenticator = null;
        }
    }

    async get() {
        return await method('GET', this.path, this.params, {}, this.authenticator);
    }

    async put(data) {
        return await method('PUT', this.path, {}, data, this.authenticator);
    }

    async post(data) {
        return await method('POST', this.path, {}, data, this.authenticator);
    }

    async patch(data) {
        return await method('PATCH', this.path, {}, data, this.authenticator);
    }

    async delete() {
        return await method('DELETE', this.path, {}, {}, this.authenticator);
    }
}
