var Paginator = require('../utils/paginator');

module.exports = {
    '/': function() {
        var self = this;
        var page = self.GET.page ? parseInt(self.GET.page) : 1;
        var template = process.argv.length > 3 ? process.argv[3] : 'podcasts';

        switch(template) {
            case 'podcasts':
                return self.data('network/podcasts').then(
                    function(context) {
                        return self.template('podcast_list', context);
                    }
                );

            case 'episodes':
                return self.data('network/home').then(
                    function(context) {
                        context.page_obj = new Paginator(context.object_list, page);

                        if(page > 1) {
                            return self.template('episode_list', context);
                        }

                        return self.template('home', context);
                    }
                );

            default:
                throw new Error('Unknown template option "' + template + '"');
        }
    },
    '/about/': function() {
        var self = this;

        return self.data('network/network_pages/about').then(
            function(context) {
                return self.template('page_detail', context);
            }
        );
    },
    '/:podcast/e/:slug/': function(podcast, slug) {
        var self = this;

        return self.data('network/episodes/' + slug).then(
            function(context) {
                return self.template('episode_detail', context);
            }
        );
    },
    '/iframe/': function(slug) {
        return this.static('iframe.html');
    },
    '/button/': function(slug) {
        return this.static('button.html');
    },
    '/app.js': function(slug) {
        return this.static('app.js');
    },
    '/404/': function(slug) {
        return this.template('page_not_found');
    },
    '/hosts/': function(slug) {
        var self = this;

        return self.data('network/network_hosts').then(
            function(context) {
                return self.template('host_list', context);
            }
        );
    },
    '/search/': function() {
        var self = this;
        var page = self.GET.page ? parseInt(self.GET.page) : 1;

        return self.data('network/network_search_results').then(
            function(context) {
                context.page_obj = new Paginator(context.object_list, page);
                return self.template('search_list', context);
            }
        );
    },
    '/:podcast/': function(podcast) {
        var self = this;
        var page = self.GET.page ? parseInt(self.GET.page) : 1;
        var template = page > 1 ? 'episode_list' : 'home';

        return self.data('network/podcast').then(
            function(context) {
                context.page_obj = new Paginator(context.object_list, page);
                return self.template(template, context);
            }
        );
    },
    '/:podcast/b/': function(podcast) {
        var self = this;
        var page = self.GET.page ? parseInt(self.GET.page) : 1;

        return self.data('network/blog_posts').then(
            function(context) {
                context.page_obj = new Paginator(context.object_list, page);
                return self.template('blogpost_list', context);
            }
        );
    },
    '/:podcast/b/:slug/': function(podcast, slug) {
        var self = this;

        return self.data('network/blog/' + slug).then(
            function(context) {
                return self.template('blogpost_detail', context);
            }
        );
    },
    '/:podcast/g/': function(podcast) {
        var self = this;
        var page = self.GET.page ? parseInt(self.GET.page) : 1;

        return self.data('network/guests').then(
            function(context) {
                context.page_obj = new Paginator(context.object_list, page);
                return self.template('guest_list', context);
            }
        );
    },
    '/:podcast/g/:slug/': function(podcast, slug) {
        var self = this;

        return self.data('network/guests/' + slug).then(
            function(context) {
                return self.template('guest_detail', context);
            }
        );
    },
    '/:podcast/about/': function(podcast) {
        var self = this;

        return self.data('network/podcast_pages/about').then(
            function(context) {
                return self.template('page_detail', context);
            }
        );
    },
    '/:podcast/hosts/': function(podcast) {
        var self = this;

        return self.data('network/podcast_hosts').then(
            function(context) {
                return self.template('host_list', context);
            }
        );
    },
    '/:podcast/search/': function(podcast) {
        var self = this;
        var page = self.GET.page ? parseInt(self.GET.page) : 1;

        return self.data('network/podcast_search_results').then(
            function(context) {
                context.page_obj = new Paginator(context.object_list, page);
                return self.template('search_list', context);
            }
        );
    }
};
