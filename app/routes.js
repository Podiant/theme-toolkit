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
        return this.html(slug);
    },
    '/iframe/': function(slug) {
        return this.static('iframe.html');
    },
    '/button/': function(slug) {
        return this.static('button.html');
    }
};
