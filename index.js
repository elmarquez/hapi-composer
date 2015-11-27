#!/bin/env node

// if NODE_CONFIG_DIR environment variable is set then emit a log messsage here
// indicating its value
if (process.env.NODE_CONFIG_DIR) {
    console.info('%s: Found NODE_CONFIG_DIR', new Date(Date.now()));
    console.info('%s: Loading configuration from ' + process.env.NODE_CONFIG_DIR, new Date(Date.now()));
} else {
    console.info('%s: Loading configuration from ' + process.cwd() + '/config', new Date(Date.now()));
}

var Hapi = require('hapi');
var Path = require('path');
var cfg = {};
var cloud = require('cloud-env');
var config = require('config');
var server;
var signals =  ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'];

//-----------------------------------------------------------------------------
// Define termination handlers.

/**
 * Terminate server on receipt of the specified signal.
 * @param {Object} srv Application server.
 * @param {String} sig Signal to terminate on.
 */
function terminate (srv, sig) {
    if (typeof sig === 'string') {
        console.info('%s: Received %s, terminating server ...', new Date(Date.now()), sig);
        srv.stop({timeout: 30 * 1000}, function (err) {
            if (err) {
                console.error(err);
            } else {
                console.info('%s: Application server stopped', new Date(Date.now()) );
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
// Apply cloud configuration values to server.app configuration

function isEnvVar (s) {
    var char = '', i;
    for (i = 0; i < s.length; i++){
        char = s.charAt(i);
        if (!isNaN(char * 1)) {
            return false;
        } else {
            if (char !== '_' && char == char.toLowerCase()){
                return false;
            }
        }
    }
    return true;
}

function stripFn (o) {
    var obj = {};
    Object.keys(o).forEach(function (key) {
        if (Array.isArray(o[key])) {
            obj[key] = o[key];
        } else if (typeof o[key] === 'object') {
            obj[key] = stripFn(o[key]);
        } else if (typeof o[key] === 'string' || typeof o[key] === 'number' || typeof o[key] === 'boolean') {
            obj[key] = o[key];
        }
    });
    return obj;
}

if (config.has('server')) {
    cfg = stripFn(config.get('server'));
    Object.keys(cloud).forEach(function (key) {
        if (isEnvVar(key) && typeof cloud.get(key) === 'string') {
            cfg.app[key] = cloud.get(key);
        }
    });
}

//-----------------------------------------------------------------------------
// Create and start the application server

// Server
server = new Hapi.Server(cfg);

// Connections
config.get('connections').forEach(function (connection) {
    console.info('%s: Adding connection ' + connection.port + ' with labels ' + connection.labels.join(', '), new Date(Date.now()));
    server.connection(connection);
});

// Plugins
config.get('plugins').forEach(function (plugin) {
    var p = Path.join(__dirname, plugin.path);
    var name = Path.basename(p);
    console.info('%s: Registering ' + name + ' plugin', new Date(Date.now()));
    server.register(require(p), plugin.options, function (err) {
        if (err) {
            console.info('%s: Failed to register plugin: ' + name + '\n\n%s', err, new Date(Date.now()));
        }
    });

});

// Handle environment signals
setupTerminationHandlers();

// Start server
server.start(function () {
    console.info('%s: Application server started at ' + server.info.uri, new Date(Date.now()));
    server.log(['info'], 'Application server started at ' + server.info.uri);
});
