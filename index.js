#!/bin/env node

var config = require('config');
var glue = require('glue');
var server = null;
var signals =  ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'];

//-----------------------------------------------------------------------------
// Define termination handlers.

/**
 * Terminate server on receipt of the specified signal.
 * @param {Object} server Application server.
 * @param {String} sig Signal to terminate on.
 */
function terminate (srv, sig) {
    if (typeof sig === 'string') {
        console.info('%s: Received %s - terminating server ...', new Date(Date.now()), sig);
        srv.stop({timeout: 30 * 1000}, function (err) {
            if (err) {
                console.error(err);
            } else {
                console.info('%s: Hapi server stopped.', new Date(Date.now()) );
                process.exit(1);
            }
        });
    }
}

/**
 * Setup termination handlers (for exit and a list of signals).
 */
function setupTerminationHandlers () {
    process.on('exit', function() { terminate(server, 'PROCESS EXIT'); });
    signals.forEach(function(signal) {
        var srv = server;
        process.on(signal, function() { terminate(srv, signal); });
    });
}

//-----------------------------------------------------------------------------
// Create and start the application server

// Load the server manifest
var manifest = {
    server: config.get('server'),
    connections: config.get('connections'),
    plugins: config.get('plugins')
};

// Glue options
var options = {relativeTo: __dirname};

// Create the application server
glue.compose(manifest, options, function (err, app) {
    if (err) { throw err; }
    server = app;
    setupTerminationHandlers();
    server.start(function () {
        var ports = manifest.connections
            .map(function (item) { return item.port; })
            .join(', ');
        console.info('%s: Hapi server listening on port(s)', new Date(Date.now()), ports);
    }, function (err) {
        console.error(err);
    });
});
