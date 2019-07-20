const inquirer = require('inquirer');
const files = require('./files');

module.exports = {
    login: () => {
        const questions = [
            {
                name: 'username',
                type: 'input',
                message: 'Enter your Podiant username:',
                validate: (value) => {
                    if (value.length) {
                        return true;
                    }

                    return 'Please enter your username.';
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter your password:',
                validate: (value) => {
                    if (value.length) {
                        return true;
                    }

                    return 'Please enter your password.';
                }
            }
        ];

        return inquirer.prompt(questions);
    }
};
