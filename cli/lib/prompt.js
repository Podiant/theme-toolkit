const _ = require('underscore');
const inquirer = require('inquirer');
const files = require('./files');

module.exports = {
    login: async () => {
        const username = process.env.PODIANT_USERNAME;
        const password = process.env.PODIANT_PASSWORD;
        let questions = [];
        let returned = {};

        if (!username) {
            questions.push(
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
                }
            );
        } else {
            returned.username = username;
        }

        if (!password) {
            questions.push(
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
            );
        } else {
            returned.password = password;
        }

        if (questions.length) {
            const prompted = await inquirer.prompt(questions);

            returned = _.extend(returned, prompted);
        }

        return returned;
    }
};
