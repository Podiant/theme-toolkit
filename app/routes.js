var Paginator = require('./utils/paginator');

module.exports = {
    '/': function() {
        var self = this;
        var page = self.GET.page ? parseInt(self.GET.page) : 1;
        var template = page > 1 ? 'episode_list' : 'home';

        return self.data('home').then(
            function(context) {
                context.page_obj = new Paginator(context.object_list, page);
                return self.template(template, context);
            }
        );
    },
    '/e/:slug/': function(slug) {
        var self = this;

        return self.data('episodes/' + slug).then(
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

        return self.data('hosts').then(
            function(context) {
                return self.template('host_list', context);
            }
        );
    }
};
