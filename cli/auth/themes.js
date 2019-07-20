const BearerTokenAuthenticator = require('./bearer');
const auth = require('../lib/auth');
const prompt = require('../lib/prompt');
const crypto = require('crypto');

module.exports = class ThemeAuthenticator extends BearerTokenAuthenticator {
    async createToken() {
        const credentials = await prompt.login();
        const username = credentials.username;
        const password = credentials.password;
        const key = process.env.PODIANT_API_KEY;
        const cipher = crypto.createCipheriv('aes-256-ecb', key, '');

        return cipher.update(
            `${username}:${password}`,
            'utf8',
            'base64'
        ) + cipher.final('base64');
    }
};
