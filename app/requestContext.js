var Template = require('./template');
var Data = require('./data');
var extend = require('./utils/extend');

module.exports = function() {
    var self = {
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
                                    '../theme/layout.hbs',
                                    {
                                        yield: function(block) {
                                            return block;
                                        }
                                    }
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
