'use strict';

module.exports = function(grunt) {
    grunt.task.registerTask('release', 'Create an application release artifact.',
      function () {
        grunt.task.run(['checkbranch:master', 'bump']);
    });
};
