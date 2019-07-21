Podiant Theme Toolkit
=====================

Everything you need to build a theme on Podiant.

Using the toolkit
-----------------

You'll need Node.js installed on your computer. If you haven't already, [download and install Node.js](https://nodejs.org/en/download/).

To verify it's installed, open a terminal window (you'll find this on a Mac in the _Applications_ > _Utilities_ folder, or in Windows 10 via the Search button in the taskbar (type "cmd" to find it)), and type `node -v`. You should see something like this:

```
v9.5.0
```

If you don't see that, consult the Node installation instructions for your operating system.

Once Node.js is setup, download this package, unzip the file (remember where you've unzipped it).

Open your terminal and type `cd` followed by the directory you just downloaded the toolkit into. For example:

```bash
cd ~/Downloads/theme-toolkit-master
```

Then run
```bash
npm install
```

This will install the package in that directory, so the next time you need to open it, you can just `cd` into the directory from your terminal.

Once the package is installed, run

```bash
npm start
```

You should see a message like this:

```
[nodemon] 1.17.3
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node app/index.js`

Development server now listening at http://0.0.0.0:8000/
```

Point your browser to http://localhost:8000/ and you should see a pretty ugly website! This is the "naked theme", which gives you a bunch of HTML and virtually no styling, so you can start to build your own theme, without having to tear apart something else.

Building your theme
-------------------

You'll find theme files in the _theme_ folder. Here's what you can expect to find:

- _theme.json_ - a file with some metadata about the theme
- _layout.hbs_ - the main layout template
- _styles.hbs.css_ - the stylesheet template
- _includes_ - a folder containing the various subtemplates that make up a theme:
  - _home.hbs_ - the homepage template
  - _episode_list.hbs_ - the episode list template (used when there are multiple pages of episodes)
  - _episode_detail.hbs_ - the single episode template
  - _blogpost_list.hbs_ - the blog post list template
  - _blogpost_detail.hbs_ - the single blog post template
  - _guest_list.hbs_ - the guest list template
  - _guest_detail.hbs_ - the single guest template
  - _host_list.hbs_ - the hostd list template
  - _page_detail.hbs_ - the arbitrary page template (used to display pages podcasters create for their shows)
  - _podcast_list.hbs_ - the podcast list template, used for network-enabled themes
  - _search_list.hbs_ - the search results template
  - _page_not_found.hbs_ - the 404 template

Open the _theme_ folder in your favourite text editor, and get coding. As you make changes, refresh your browser to see how your theme will look.

The anatomy of the _theme.json_ file
------------------------------------

This file is used to give details about the theme: its name, the current version number (which you must increment when you update the theme), the description, a list of customisable options and a set of third-party components that are used with the theme.

### Example

```json
{
    "name": "Naked",
    "version": "2.1",
    "description": "A barebones, virtually unstyled base theme",
    "components": [
        {
            "library": "font-awesome",
            "version": "4.7.0",
            "css": [
                "css/font-awesome.min.css"
            ]
        },
        {
            "library": "jqueryui",
            "version": "1.11.4",
            "css": [
                "jquery-ui.min.css"
            ],
            "js": [
                "jquery-ui.min.js"
            ]
        }
    ],
    "options": [
        [
            "Typography",
            {
                "fields": [
                    {
                        "name": "text_font_family",
                        "default": "Open Sans",
                        "type": "typeface"
                    },
                    {
                        "name": "text_color",
                        "default": "#000000",
                        "type": "color"
                    }
                ]
            }
        ],
        [
            "Static text",
            {
                "fields": [
                    {
                        "name": "string_no_resuots",
                        "default": "Sorry, there aren’t any items matching your search.",
                        "label": "No search results found"
                    }
                ]
            }
        ],
        [
            "Miscellaneous",
            {
                "fields": [
                    {
                        "name": "date_format",
                        "default": "MMMM Do, YYYY",
                        "choices": [
                            ["YYYY-MM-DD", "1991-08-16"],
                            ["d MMMM YYYY", "16 August 1991"],
                            ["Do MMMM, YYYY", "16th August, 1991"],
                            ["MMMM Do, YYYY", "August 16th, 1991"],
                            ["dddd, MMMM Do, YYYY", "Friday, August 16th, 1991"]
                        ]
                    }
                ]
            }
        ]
    ]
}
```

### Theme name

The name... y'know... of the theme. It must be unique.

### Version number

Any string will do, but a simple `>=` (equal to or greater than) comparison is done when uploading the theme, to ensure that the version number has increased, so make sure it's a string that increments from right-to-left. For example, the date `2019.08.16` is good because it can be evaluated against another date of the same format, whereas `08/16/2019` won't work. You can also use semantic notation like `1.0.1`.

### Description

A short sentence describing the theme.

### Options

A nested list of fieldset names (groups of fields), and individual fields. Stick to the format above and you should be fine. Teh system supports strings (where the type is set to `string` or `text` for long text), `typeface` (for a subset of fonts provided by Google Fonts), and `color` (for a colour picker).

### Components

A list of components from Cloudflare's [cdnjs](https://cdnjs.com/) service. This is really useful if you want to include things like font-face icon packs or jQuery plugins that can be activated without any additional code. (Podiant does not permit arbitrary code injection in any of its themes, so be sure to choose JavaScript components that can be executed based on class names or other DOM attributes.)

Getting inspiration from an existing theme
------------------------------------------

The _sample-themes_ folder contains the a couple of themes that were added to Podiant. Between these themes and the naked them you'll find in the _theme_ directory, you'll have a pretty comprehensive overview of what it's possible to achieve when building a Podiant theme.

Customising the information provided to a theme
-----------------------------------------------

The _data_ directory holds a number of JSON files which are used to populate the theme with sample data. You can change this if you like, but it should be fairly complete.

The _data_ directory is not part of your theme, and is just provided so that you've got some sample content to work with. Make sure to fit your template around the data, not the other way around!

Uploading your theme
--------------------

A limited subset of users may be given permission to upload themes to the Podiant theme directory, or to update an existing theme for their website. If you're interested in developing themes for Podiant, [contact me](https://github.com/iamsteadman/).

The theme toolkit comes with a CLI which will allow you to publish the theme you've built within the _theme_ directory. Run it from the directory you downloaded this toolkit to (so not from within the _theme_ directory).

To upload a theme, simply run `podiant themes publish`. Output should look something like this:

```
____                _   _                   _
|  _ \    ___     __| | (_)   __ _   _ __   | |_
| |_) |  / _ \   / _` | | |  / _` | | '_ \  | __|
|  __/  | (_) | | (_| | | | | (_| | | | | | | |_
|_|      \___/   \__,_| |_|  \__,_| |_| |_|  \__|

Loaded theme metadata
Bundled HTML layout
Bundled CSS
Bundled blogpost_detail template
Bundled blogpost_list template
Bundled episode_detail template
Bundled episode_list template
Bundled guest_detail template
Bundled guest_list template
Bundled home template
Bundled host_list template
Bundled page_detail template
Bundled page_not_found template
Bundled search_list template
👍
```

Any problems?
-------------

If you find a bug, you can log an issue using the Issues section above.

Who made this?
--------------

The Podiant theme toolkit was made by me, Mark Steadman, the developer behind [Podiant](https://podiant.co/). I built it to make my own theme development easier, but I sincerely hope it'll be a useful resource for anyone else who wants to make Podiant themes.
