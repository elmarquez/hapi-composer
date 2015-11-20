'use strict';

module.exports = function(grunt) {
    grunt.registerTask('serve',
        'Run the application server and restart when a source file changes.',
        ['env', 'nodemon']);
};