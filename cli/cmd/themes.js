const chalk = require('chalk');
const files = require('../lib/files');
const Theme = require('../models/themes');
const ValidationException = require('../exceptions/validation');
const CLI = require('clui');
const Spinner = CLI.Spinner;

module.exports = {
    help: ([...args], kwargs) => {
        if (args.length || Object.keys(kwargs).length) {
            console.error(
                chalk.red('Invalid arguments')
            );

            return false;
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

            return false;
        }

        if (!files.directoryExists('theme')) {
            console.error(
                chalk.red(
                    'No theme directory found.'
                )
            );

            return false;
        }

        const theme = Theme.from(
            files.getThemeDirectory()
        );

        if (!theme.id) {
            const themes = await Theme.objects.filter(
                {
                    name: theme.attr('name')
                }
            ).load();

            themes.forEach(
                (existing) => {
                    theme.attr('id', existing.attr('id'));
                }
            );
        }

        if (!theme.attr('id')) {
            console.log('Creating a new theme');
        }

        const status = new Spinner(
            'Validating and saving theme'
        );

        status.start();

        try {
            return await theme.save();
        } catch (err) {
            status.stop();

            if (err instanceof ValidationException) {
                if (err.errors) {
                    console.error(chalk.red('The theme contains errors.'));
                } else {
                    console.error(chalk.red(err.detail));
                }

                Object.keys(err.errors).forEach(
                    (key) => {
                        console.error(
                            `  ${chalk.red(key)}: ${err.errors[key]}`
                        );
                    }
                );

                return false;
            }

            throw err;
        } finally {
            status.stop();
        }
    }
};
