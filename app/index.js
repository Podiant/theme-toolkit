var chalk = require('chalk');
var baseContext = process.argv.length > 2 ? process.argv[2] : 'podcast';
var server = require('./server');

switch(baseContext) {
    case 'podcast':
    case 'network':
        break;

    default:
        console.error(
            chalk.red('Unknown context. Run "npm start" or "npm start podcast" to test podcast-related theme features, or "npm start network" to test network-related features.')
        );

        return;
}

server(baseContext);
