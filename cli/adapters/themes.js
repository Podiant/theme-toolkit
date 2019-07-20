const AdapterBase = require('../lib/adapters');
const ThemeAuthenticator = require('../auth/themes');

module.exports = class ThemeAdapter extends AdapterBase {
    constructor() {
        super(
            {
                authenticator: new ThemeAuthenticator()
            }
        );
    }
}
