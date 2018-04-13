var fs = require('fs');
var mime = require('mime-types')
var path = require('path');
var Template = require('./utils/template');
var Data = require('./utils/data');
var extend = require('./utils/extend');

module.exports = function(meta) {
    var self = {
        path: meta.path,
        method: meta.method,
        GET: (
            function(qs) {
                if(!qs) {
                    return {};
                }

                var split = qs.split('&');
                var pair, key, value;
                var returned = {};

                for(var i = 0; i < split.length; i ++) {
                    pair = split[i].split('=');
                    key = decodeURIComponent(pair[0]);
                    value = decodeURIComponent(pair[1]);

                    returned[key] = value;
                }

                return returned;
            }
        )(meta.GET),
        respond: function(code, contentType, content) {
            return new Promise(
                function(resolve, reject) {
                    resolve(
                        {
                            code: code,
                            headers: {
                                'Content-Type': contentType
                            },
                            content: content
                        }
                    );
                }
            )
        },
        data: function(filename) {
            return new Promise(
                function(resolve, reject) {
                    new Data(filename).load().then(resolve).catch(reject);
                }
            );
        },
        static: function(filename) {
            var extname = path.extname(filename);

            return new Promise(
                function(resolve, reject) {
                    fs.readFile(
                        path.join(__dirname, 'static/' + filename),
                        function(err, content) {
                            if(err) {
                                reject(err);
                                return;
                            }

                            resolve(
                                {
                                    code: 200,
                                    headers: {
                                        'Content-Type': mime.lookup(extname)
                                    },
                                    content: content
                                }
                            );
                        }
                    );
                }
            );
        },
        html: function(html) {
            return self.respond(200, 'text/html', html);
        },
        template: function(name, subContext) {
            return new Promise(
                function(resolve, reject) {
                    try {
                        var template = new Template(
                            '../theme/includes/' + name + '.hbs'
                        )
                    } catch(err) {
                        reject(err);
                        return;
                    }

                    self.data('base').then(
                        function(baseContext) {
                            var context = extend(
                                baseContext, subContext
                            );

                            var wrapBase = function(html, css) {
                                return new Template('templates/base.hbs',
                                    {
                                        css_block: function() {
                                            return Template.safe(css);
                                        },
                                        html_block: function() {
                                            return html;
                                        }
                                    }
                                ).render();
                            };

                            var wrapTheme = function(html) {
                                return new Template(
                                    '../theme/layout.hbs'
                                ).render(
                                    extend(
                                        {
                                            main: Template.safe(html)
                                        },
                                        context
                                    )
                                );
                            };

                            var wrapCSS = function() {
                                return new Template('../theme/styles.hbs.css').render(context);
                            };

                            template.render(context).then(
                                function(rendered) {
                                    wrapTheme(rendered).then(
                                        function(rendered2) {
                                            wrapCSS().then(
                                                function(rendered3) {
                                                    wrapBase(rendered2, rendered3).then(
                                                        function(html) {
                                                            self.html(html).then(
                                                                resolve
                                                            ).catch(
                                                                reject
                                                            );
                                                        }
                                                    ).catch(reject)
                                                }
                                            )
                                        }
                                    ).catch(reject);
                                }
                            ).catch(reject);
                        }
                    );
                }
            )
        }
    };

    return self;
};
