const fs = require('fs');
const path = require('path');
const ThemeAdapter = require('../adapters/themes');
const ModelBase = require('../lib/models');
const Exception = require('../lib/errors');

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

    theme.templates = {};
    views.forEach(
        (view) => {
            const filename = path.join(dirname, 'includes', view + '.hbs');

            try {
                if (fs.statSync(filename).isFile()) {
                    theme.templates[view.replace(/-/g, '_')] = fs.readFileSync(
                        filename
                    ).toString(
                        'utf8'
                    );
                }
            } catch {
                return;
            }
        }
    );

    const layoutFilename = path.join(dirname, 'layout.hbs');

    try {
        if (fs.statSync(layoutFilename).isFile()) {
            theme['layout-html'] = fs.readFileSync(
                layoutFilename
            ).toString('utf8');
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
        }
    } catch {
        throw new Exception('styles.hbs.css does not exist.');
    }

    return new Theme(theme);
};

module.exports = Theme;