var Handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var Template = function(baseContext, filename, helpers) {
    switch(baseContext) {
        case 'podcast':
            break;

        case 'network':
            break;

        default:
            throw new Error('Unknown template rendering context: ' + baseContext);
    }

    var templatePath = path.join(__dirname, '../' + filename);
    var self = {
        render: function(context) {
            return new Promise(
                function(resolve, reject) {
                    fs.readFile(templatePath, 'utf8',
                        function(err, data) {
                            if(err) {
                                console.error(err);
                                reject(new Error('Template file could not be read. Make sure you\'ve created the appropriate file.'));
                                return;
                            }

                            try {
                                var compiled = Handlebars.compile(data);

                                resolve(
                                    compiled(context)
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

    if(typeof(helpers) == 'object') {
        Object.keys(helpers).forEach(
            function(key) {
                Handlebars.registerHelper(key, helpers[key]);
            }
        );
    }

    return self;
};

Handlebars.registerHelper('date',
    function(value, format) {
        return moment(value).format(format);
    }
);

Handlebars.registerHelper('exists',
    function(value, context) {
        if(Array.isArray(value)) {
            if(!value.length) {
                return context.inverse(this);
            }
        } else {
            if(!Object.keys(value).length) {
                return context.inverse(this);
            }
        }

        if(value) {
            return context.fn(this);
        }

        return context.inverse(this);
    }
);

Handlebars.registerHelper('yield',
    function(block) {
        return block;
    }
);

Template.safe = function(str) {
    return new Handlebars.SafeString(str);
};

module.exports = Template;
