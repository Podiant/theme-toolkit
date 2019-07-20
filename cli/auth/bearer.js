const AuthenticatorBase = require('../lib/auth');


module.exports = class BearerTokenAuthenticator extends AuthenticatorBase {
    createToken(request) {
        throw new Error('Method not implemented');
    }

    async authenticate(request) {
        const token = await this.createToken();

        request.headers['Authorization'] = `Bearer ${token}`;
        return request;
    }
};
