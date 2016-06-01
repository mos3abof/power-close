module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
        preprocessors: {
            'src/**/*.js': ['babel', 'coverage'],
            'test/**/*.js': ['babel']
        },
        babelPreprocessor: {
            options: { presets: ['es2015'] }
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            type: 'text-summary'
        },
        files: [
            'test/**/*.js'
        ],
        singleRun: true
    });
};
