const crypto = require('crypto');

module.exports = {
    createToken: (username, password) => {
        const key = process.env.PODIANT_API_KEY;
        const cipher = crypto.createCipheriv('aes-256-ecb', key, '');
        const credentials = `${username}:${password}`;

        return cipher.update(
            credentials,
            'utf8',
            'base64'
        ) + cipher.final('base64');
    }
};
