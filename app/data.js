var fs = require('fs');
var path = require('path');

module.exports = function(filename) {
    var self = {
        load: function() {
            return new Promise(
                function(resolve, reject) {
                    fs.readFile(
                        path.join(__dirname, '../data/' + filename + '.json'),
                        'utf8',
                        function(err, data) {
                            if(err) {
                                reject(new Error('Data file could not be read. Make sure you\'ve created the appropriate file.'));
                                return;
                            }

                            try {
                                resolve(
                                    JSON.parse(data)
                                );
                            } catch(err) {
                                reject(err);
                            }
                        }
                    );
                }
            );
        }
    };

    return self;
};
