const fs = require('fs');
const path = require('path');
const ThemeAdapter = require('../adapters/themes');
const ModelBase = require('../lib/models');
const Exception = require('../lib/errors');
const QuerySet = require('../lib/query');

class Theme extends ModelBase {
    constructor(data) {
        super(
            'themes',
            data,
            {
                adapter: new ThemeAdapter()
            }
        );
    }
};

Theme.from = (dirname) => {
    const filename = path.join(dirname, 'theme.json');
    const views = [
        'blogpost_detail',
        'blogpost_list',
        'episode_detail',
        'episode_list',
        'guest_detail',
        'guest_list',
        'home',
        'host_list',
        'page_detail',
        'page_not_found',
        'podcast_list',
        'search_list'
    ];

    try {
        if (!fs.statSync(filename).isFile()) {
            throw new Exception('theme.json file is not a valid file.');
        }
    } catch (err) {
        throw new Exception('theme.json file does not exist in theme directory.');
    }

    let theme = {};

    try {
        theme = JSON.parse(fs.readFileSync(filename))
    } catch (err) {
        throw new Exception('theme.json is invalid.');
    }

    console.log('Loaded theme metadata');

    const layoutFilename = path.join(dirname, 'layout.hbs');

    try {
        if (fs.statSync(layoutFilename).isFile()) {
            theme['layout-html'] = fs.readFileSync(
                layoutFilename
            ).toString('utf8');

            console.log('Bundled HTML layout');
        }
    } catch {
        throw new Exception('input.hbs does not exist.');
    }

    const cssFilename = path.join(dirname, 'styles.hbs.css');

    try {
        if (fs.statSync(cssFilename).isFile()) {
            theme.css = fs.readFileSync(
                cssFilename
            ).toString('utf8');

            console.log('Bundled CSS');
        }
    } catch {
        throw new Exception('styles.hbs.css does not exist.');
    }

    theme.templates = {};
    theme.partials = {};
    theme.networks = false;

    views.forEach(
        (view) => {
            const filename = path.join(dirname, 'templates', view + '.hbs');

            try {
                if (fs.statSync(filename).isFile()) {
                    theme.templates[view.replace(/-/g, '_')] = fs.readFileSync(
                        filename
                    ).toString(
                        'utf8'
                    );

                    if (view === 'podcast_list') {
                        theme.networks = true;
                    }

                    console.log(`Bundled ${view} template`);
                }
            } catch {
                return;
            }
        }
    );

    var partials = [];

    try {
        partials = fs.readdirSync(
            path.join(dirname, 'partials')
        );
    } catch (err) {}

    partials.forEach(
        function(file) {
            if (file.substr(file.length - 4) !== '.hbs') {
                return;
            }

            const view = file.substr(0, file.length - 4);
            const filename = path.join(dirname, 'partials', file);

            try {
                if (fs.statSync(filename).isFile()) {
                    theme.partials[view] = fs.readFileSync(
                        filename
                    ).toString(
                        'utf8'
                    );

                    console.log(`Bundled ${view} partial`);
                }
            } catch {
                return;
            }
        }
    );

    const id = theme.id;

    if (theme.id) {
        delete theme.id;
    }

    const obj = new Theme(theme);

    if (id) {
        obj.attr('id', id);
    }

    return obj;
};

Theme.objects = QuerySet('themes', Theme);

module.exports = Theme;
