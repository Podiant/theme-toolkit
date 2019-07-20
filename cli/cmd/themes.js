const chalk = require('chalk');
const files = require('../lib/files');
const Theme = require('../models/themes');
const ValidationException = require('../exceptions/validation');

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

        const theme = Theme.from(
            files.getThemeDirectory()
        );

        try {
            return await theme.save();
        } catch (err) {
            if (err instanceof ValidationException) {
                console.error(chalk.red(err.detail));
                Object.keys(err.errors).forEach(
                    (key) => {
                        console.error(
                            `  ${key}: ${err.errors[key]}`
                        );
                    }
                );

                return false;
            }

            throw err;
        }
    }
};
