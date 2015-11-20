'use strict';

module.exports = {
    options: {
        failOnError: false,
        wait: false
    },
    server: {
        cmd: 'node',
        args: [
            'index.js',
            '--mock'
        ]
    }
};
