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
var Promise = require('bluebird');
var cloud = require('cloud-env');
var config = require('config');
var manifest = {};
var module;
var pkg;
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

manifest = stripFn(config.get('server'));
if (!manifest.app) {
    manifest.app = {};
}

Object.keys(cloud).forEach(function (key) {
    if (isEnvVar(key) && typeof cloud.get(key) === 'string') {
        manifest.app[key] = cloud.get(key);
    }
});

if (config.has('IP')) {
    manifest.IP = config.get('IP');
}

if (config.has('PORT')) {
    manifest.PORT = config.get('PORT');
}

//-----------------------------------------------------------------------------
// Create and start the application server

// Server
server = new Hapi.Server(manifest);

// Open connections
config.get('connections').forEach(function (connection) {
    console.info('%s: Adding connection port %s with labels %s', new Date(Date.now()), connection.port, connection.labels.join(', '));
    server.connection(connection);
});

// Register plugins, then set termination handlers then start the server
Promise
    .resolve(config.get('plugins'))
    .each(function (plugin) {
        return new Promise(function (resolve, reject) {
            console.info('%s: Registering plugin %s', new Date(Date.now()), plugin.path);
            if (plugin.path.charAt(0) === '.') {
                plugin.path = Path.join(process.cwd(), plugin.path);
            }
            try {
                module = require(plugin.path);
                plugin.pluginOptions = plugin.pluginOptions || {};
                plugin.pluginOptions.register = module.register;
                plugin.registrationOptions = plugin.registrationOptions || {};
            } catch (err) {
                reject('Plugin ' + plugin.path + ' not found.');
            }
            server.register(plugin.pluginOptions, plugin.registrationOptions, function (err) {
                if (err) {
                    reject(err);
                } else {
                    // Execute post-registration actions. This is valid only for js
                    // based configuration files.
                    if (plugin.afterRegistration && typeof plugin.afterRegistration === 'function') {
                        try {
                            delete plugin.pluginOptions.register;
                        } catch (e) {}
                        plugin.afterRegistration(plugin, server);
                    }
                    resolve(plugin.path);
                }
            });
        });
    })
    .then(function () {
        // Handle environment signals
        setupTerminationHandlers();
        // Start server
        server.start(function () {
            var connections = server.connections.map(function (connection) {
                return connection.info.uri;
            });
            console.info('%s: Application server started at %s', new Date(Date.now()), connections.join(', '));
            server.log(['info'], 'Application server started at ' + connections.join(', '));
        });
    })
    .catch(function (err) {
        console.error('%s: Server composition failed', new Date(Date.now()));
        throw new Error(err);
    });
