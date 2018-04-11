module.exports = {
    '/': function() {
        var self = this;

        return self.data('home').then(
            function(context) {
                return self.template('home', context);
            }
        );
    },
    '/e/:slug': function(slug) {
        return this.html(slug);
    }
};
