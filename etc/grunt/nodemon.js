'use strict';

module.exports = {
    api: {
        options: {
            cwd: '.',
            ext: 'js,html',
            nodeArgs: ['--debug'],
            watch: [ 'index.js','lib/**/*' ]
        },
        script: 'index.js'
    }
};
