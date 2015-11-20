/* jshint indent:false */
'use strict';

var Path = require('path');

module.exports = function (grunt) {
    // Load the Grunt task definitions and configurations from the /conf/grunt
    // folder.
    require('load-grunt-config')(grunt, {
        init: true,
        configPath: Path.join(process.cwd(), 'etc', 'grunt'),
        loadGruntTasks: {
            pattern: 'grunt-*',
            config: require('./package.json'),
            scope: 'devDependencies'
        }
    });

    grunt.config.set('cwd', process.cwd());
    grunt.config.set('pkg', grunt.file.readJSON('package.json'));
};
