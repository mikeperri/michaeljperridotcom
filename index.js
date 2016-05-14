'use strict';

const Hapi = require('hapi');
const path = require('path');
const server = new Hapi.Server();
server.connection({ port: 80 });

server.start((err) => {
    if (err) {
        throw err;
    }

    console.log('Server running at:', server.info.uri);
});

server.register(require('inert'), (err) => {
    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public/',
                redirectToSlash: true
            }
        }
    });
});

server.ext('onPreResponse', function (request, reply) {
    // Route 404's to homepage
    if (request.response.isBoom) {
        //return reply.redirect('/');
    }

    return reply.continue();
});

require('./views.js')(server);
