module.exports = {
    options: {
        globals: ['expect'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'tap'
    },
    test: {
        src: ['test/**/*.js']
    }
};