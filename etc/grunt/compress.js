'use strict';

module.exports = {
    dist: {
        options: {
          archive: 'release/<%= pkg.name %>-<%= pkg.version %>.zip'
        },
        expand: true,
        cwd: '.',
        src: [
            'LICENSE',
            'README.MD',
            'deplist.txt',
            'index.js',
            'lib/**/*',
            'manifest.yml',
            'package.json',
            'config/**/*',
            'plugins/**/*'
        ]
    }
};
