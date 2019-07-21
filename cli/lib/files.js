const fs = require('fs');
const path = require('path');

module.exports = {
    getCurrentDirectory: () => process.cwd(),
    getThemeDirectory: (...args) => {
        return path.join(
            process.cwd(),
            'theme',
            ...args
        );
    },
    directoryExists: (filePath) => {
        try {
            return fs.statSync(filePath).isDirectory();
        } catch (err) {
            return false;
        }
    }
};
