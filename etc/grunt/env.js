'use strict';

module.exports = {
    serve: {
        NODE_CONFIG_DIR: process.cwd() + '/config'
    },
    test: {
        NODE_CONFIG_DIR: './',
        NODE_ENV: 'test'
    }
};