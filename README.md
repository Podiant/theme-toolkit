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

Point your browser to http://localhost:8000/ and you should see a website that looks like a Podiant podcast page.

Building your theme
-------------------

You'll find theme files in the _theme_ folder. Here's what you can expect to find:

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
  - _search_list.hbs_ - the search results template
  - _page_not_found.hbs_ - the 404 template

Open the _theme_ folder in your favourite text editor, and get coding. As you make changes, refresh your browser to see how your theme will look.

Customising the information provided to a theme
-----------------------------------------------

The _data_ directory holds a number of JSON files which are used to populate the theme with sample data. You can change this if you like, but it should be fairly complete.

The _data_ directory is not part of your theme, and is just provided so that you've got some sample content to work with. Make sure to fit your template around the data, not the other way around!

Any problems?
-------------

If you find a bug, you can log an issue using the Issues section above.

Who made this?
--------------

The Podiant theme toolkit was made by me, Mark Steadman, the developer behind [Podiant](https://podiant.co/). I built it to make my own theme development easier, but I sincerely hope it'll be a useful resource for anyone else who wants to make Podiant themes.
