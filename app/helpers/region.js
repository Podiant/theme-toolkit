var Handlebars = require('handlebars');

module.exports = function region(name, context) {
    var base = context.data.root;
    var regions = base.regions;
    var widgets = base.widgets;
    var html = '';
    var Template = require('../utils/template');

    Object.values(regions[name]).forEach(
        function(widgetNamePair, index) {
            var split = widgetNamePair.split('.');
            var context = split[0];
            var widgetName = split[1];

            if (context === 'theme') {
                var widget = widgets[widgetName];
                var classNames = [
                    'widget',
                    'theme-widget',
                    `widget-${widgetName}`,
                    `widget-index-${index + 1}`
                ];

                if (widget && widget.partial) {
                    var template = new Template(
                        'podcast',
                        `../theme/partials/${widget.partial}.hbs`
                    );

                    html += (
                        `<div class="${classNames.join(' ')}">` +
                        `<div class="widget-content">${template.renderSync(base)}</div>` +
                        `</div>`
                    );
                }
            }
        }
    );

    return new Handlebars.SafeString(html);
};
