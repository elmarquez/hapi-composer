'use strict';

module.exports = {
    options: {
        jshintrc: 'etc/jshint.json'
    },
    conf: {
        src: ['etc/**/*.js','gruntfile.js']
    },
    src: {
        src: ['index.js','lib/**/*.js']
    },
    test: {
        src: ['test/**/*.js']
    }
};
