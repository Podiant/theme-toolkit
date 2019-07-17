var fs = require('fs');
var mime = require('mime-types')
var path = require('path');
var Template = require('./template');
var Data = require('./data');
var extend = require('./extend');

module.exports = function(renderingContext, meta) {
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
                        path.join(__dirname, '../static/' + filename),
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
                            renderingContext,
                            '../theme/includes/' + name + '.hbs'
                        )
                    } catch(err) {
                        reject(err);
                        return;
                    }

                    var baseData = function() {
                        return new Promise(
                            function(resolve, reject) {
                                var optionsFilename = path.join(
                                    __dirname,
                                    '../',
                                    '../',
                                    'theme',
                                    'options.json'
                                );

                                self.data(renderingContext + '/base').then(
                                    function(data) {
                                        try {
                                            if (fs.existsSync(optionsFilename)) {
                                                fs.readFile(
                                                    optionsFilename,
                                                    'utf8',
                                                    function(err, content) {
                                                        if(err) {
                                                            reject(err);
                                                            return;
                                                        }

                                                        var themeOptions = {};

                                                        JSON.parse(content).forEach(
                                                            function(fieldset) {
                                                                fieldset[1].fields.forEach(
                                                                    function(field) {
                                                                        if(field.default) {
                                                                            themeOptions[field.name] = field.default;
                                                                        }
                                                                    }
                                                                )
                                                            }
                                                        );

                                                        data.theme_options = themeOptions;
                                                    }
                                                );
                                            }

                                            resolve(data);
                                        } catch (err) {
                                            reject(err);
                                        }
                                    }
                                );
                            }
                        );
                    };

                    baseData().then(
                        function(baseContext) {
                            var context = extend(
                                baseContext, subContext
                            );

                            var wrapInjections = function() {
                                var componentsFilename = path.join(
                                    __dirname,
                                    '../',
                                    '../',
                                    'theme',
                                    'components.json'
                                );

                                return new Promise(
                                    function(resolve, reject) {
                                        if (fs.existsSync(componentsFilename)) {
                                            fs.readFile(
                                                componentsFilename,
                                                'utf8',
                                                function(err, content) {
                                                    if(err) {
                                                        reject(err);
                                                        return;
                                                    }

                                                    resolve(
                                                        content ? JSON.parse(content) : []
                                                    );
                                                }
                                            );
                                        } else {
                                            resolve('');
                                        }
                                    }
                                );
                            }

                            var wrapBase = function(html, css, components) {
                                return new Template(
                                    renderingContext,
                                    'templates/base.hbs',
                                    {
                                        css_block: function() {
                                            return Template.safe(css);
                                        },
                                        html_block: function() {
                                            return html;
                                        },
                                        theme_head: function() {
                                            if(!Array.isArray(components)) {
                                                return '';
                                            }

                                            var h = '';
                                            var url = function(component, path) {
                                                return `https://cdnjs.cloudflare.com/ajax/libs/${component.library}/${component.version}/${path}`;
                                            };

                                            var component = function(component) {
                                                var t = '';

                                                if (Array.isArray(component.css)) {
                                                    for(var i = 0; i < component.css.length; i ++) {
                                                        t += '<link rel="stylesheet" href="' + url(component, component.css[i]) + '">';
                                                    }
                                                }

                                                if (Array.isArray(component.js)) {
                                                    for(var i = 0; i < component.js.length; i ++) {
                                                        t += '<script src="' + url(component, component.js[i]) + '"></script>';
                                                    }
                                                }

                                                return t;
                                            };

                                            for (var i = 0; i < components.length; i ++) {
                                                h += component(
                                                    components[i]
                                                );
                                            }

                                            return Template.safe(h);
                                        }
                                    }
                                ).render();
                            };

                            var wrapTheme = function(html) {
                                return new Template(
                                    renderingContext,
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
                                return new Template(
                                    renderingContext,
                                    '../theme/styles.hbs.css').render(context);
                            };

                            template.render(context).then(
                                function(rendered) {
                                    wrapTheme(rendered).then(
                                        function(rendered2) {
                                            wrapCSS().then(
                                                function(rendered3) {
                                                    wrapInjections().then(
                                                        function(injections) {
                                                            wrapBase(
                                                                rendered2,
                                                                rendered3,
                                                                injections
                                                            ).then(
                                                                function(html) {
                                                                    self.html(html).then(
                                                                        resolve
                                                                    ).catch(
                                                                        reject
                                                                    );
                                                                }
                                                            ).catch(reject);
                                                        }
                                                    ).catch(reject);
                                                }
                                            );
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
