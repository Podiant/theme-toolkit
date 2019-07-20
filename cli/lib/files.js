const fs = require('fs');
const path = require('path');

module.exports = {
    getThemeDirectory: () => {
        return path.join(
            path.basename(process.cwd()),
            'theme'
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
