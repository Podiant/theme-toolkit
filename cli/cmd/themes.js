const chalk = require('chalk');
const files = require('../lib/files');
const prompt = require('../lib/prompt');
const auth = require('../lib/auth');

module.exports = {
    help: ([...args]) => {
        if (args.length) {
            console.error(
                chalk.red('Invalid arguments')
            );

            return;
        }

        console.log('Interact with Podiant themes.')
        console.log('Usage:');
        console.log('  themes publish: Publish a new theme or update an existing one');
        console.log();
    },
    publish: async ([...args]) => {
        if (args.length) {
            console.error(
                chalk.red('Invalid arguments')
            );

            return;
        }

        if (!files.directoryExists('theme')) {
            console.error(
                chalk.red(
                    'No theme directory found.'
                )
            );

            return;
        }

        const credentials = await prompt.login();
        const username = credentials.username;
        const password = credentials.password;
        const token = auth.createToken(username, password);
    }
};
