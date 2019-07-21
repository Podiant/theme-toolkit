const chalk = require('chalk');
const files = require('../lib/files');
const fs = require('fs');
const path = require('path');
const Theme = require('../models/themes');
const s3 = require('../lib/s3');
const uniqueID = require('../lib/unique_id');
const ValidationException = require('../exceptions/validation');
const CLI = require('clui');
const Spinner = CLI.Spinner;

const uploadScreenshot = async (filename, slug) => {
    try {
        if (!fs.statSync(filename).isFile()) {
            console.warn('No screenshot found. This might cause a problem later.')
            return;
        }
    } catch (err) {
        console.warn('No screenshot file. This might cause a problem later.')
        return;
    }

    const status = new Spinner('Uploading screenshot');
    const keyName = `themes/${slug}.png`;
    const mediaDomain = process.env.MEDIA_HOST || 'media.podiant.co';
    const mediaProtocol = process.env.PODIANT_SSL === 'false' ? 'http' : 'https';

    status.start();

    try {
        await s3.putFile(filename, `media/${keyName}`);
        return `${mediaProtocol}://${mediaDomain}/${keyName}`;
    } finally {
        status.stop();
    }
}

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
    publish: async ([...args], kwargs) => {
        if (args.length) {
            console.error(
                chalk.red('Invalid arguments')
            );

            return false;
        }

        if (!kwargs.samedir && !files.directoryExists('theme')) {
            console.error(
                chalk.red(
                    'No theme directory found.'
                )
            );

            return false;
        }

        const themeDir = kwargs.samedir ? files.getCurrentDirectory() : files.getThemeDirectory();
        const theme = Theme.from(themeDir);
        const screenshotFilename = path.join(themeDir, 'screenshot.png');
        let screenshotURL = '';

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

        try {
            screenshotURL = await uploadScreenshot(
                screenshotFilename,
                theme.attr('id') || uniqueID()
            );

            theme.attr('screenshot', screenshotURL);
        } catch (err) {
            console.warn(
                chalk.red('Error uploading screenshot: ' + err.message)
            );
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
