module.exports = {
    '/': function() {
        var self = this;

        return self.data('home').then(
            function(context) {
                return self.template('home', context);
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
