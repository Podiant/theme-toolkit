#!/usr/bin/env node

const chalk = require('chalk');
const figlet = require('figlet');
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));
const cmd = require('./cmd/index');

console.log(
    chalk.yellow(
        figlet.textSync(
            'Podiant',
            {
                horizontalLayout: 'full'
            }
        )
    )
);

const run = async () => {
    if (args._.length < 1) {
        cmd.help();
        return;
    }

    if (args._[0] === 'help') {
        cmd.help();
        return;
    }

    const context = cmd[args._[0]];
    let subArgs = args._.slice(1);

    if (typeof(context) === 'undefined') {
        console.error(
            chalk.red(`Unknown command: ${args._[0]}`)
        );

        return;
    }

    if (!subArgs.length) {
        subArgs = ['help'];
    }

    const command = context[subArgs[0]];

    if (typeof (command) === 'undefined') {
        console.error(
            chalk.red(`Unrecognized subcommand: ${subArgs[0]}`)
        );

        return;
    }

    command([...subArgs.slice(1)])
}

run();
