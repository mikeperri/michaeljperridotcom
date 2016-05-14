const Handlebars = require('handlebars');
const HandlebarsLayouts = require('handlebars-layouts');
const handlebarsEngine = Handlebars.create();
HandlebarsLayouts.register(handlebarsEngine);

module.exports = function Views(server) {

    server.register(require('vision'), (err) => {
        server.views({
            engines: {
                html: handlebarsEngine
            },
            relativeTo: __dirname,
            path: './views',
            partialsPath: './views/partials'
        });

        server.route({
            method: 'GET',
            path: '/',
            handler: {
                view: {
                    template: 'home',
                    context: {
                        title: 'michaeljperri.com',
                        life: true
                    }
                }
            }
        });

        server.route({
            method: 'GET',
            path: '/1337moji-privacy',
            handler: {
                view: {
                    template: '1337moji-privacy',
                    context: {
                        title: '1337moji Privacy Policy',
                        life: true
                    }
                }
            }
        });
    });
};
