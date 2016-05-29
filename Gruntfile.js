module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            options: {},
            dist: ['temp', 'dist']
        },
        jscs: {
            options: { preset: 'airbnb', validateIndentation: 4, requireTrailingComma: false, maximumLineLength: 120 },
            dist: ['Gruntfile.js', 'karma.conf.js', 'src/**/*.js']
        },
        jshint: {
            options: { esversion: 6 },
            dist: ['Gruntfile.js', 'karma.conf.js', 'src/**/*.js']
        },
        babel: {
            options: { presets: ['es2015'] },
            dist: {
                files: {
                    'temp/background.js': 'src/background.js',
                    'temp/popup/popup.js': 'src/popup/popup.js'
                }
            }
        },
        htmlmin: {
            options: { collapseWhitespace: true },
            dist: {
                files: {
                    'temp/popup/popup.html': 'src/popup/popup.html'
                }
            }
        },
        cssmin: {
            options: {},
            dist: {
                files: {
                    'temp/popup/popup.css': 'src/popup/popup.css'
                }
            }
        },
        uglify: {
            options: {},
            dist: {
                files: {
                    'temp/background.js': 'temp/background.js',
                    'temp/popup/popup.js': 'temp/popup/popup.js'
                }
            }
        },
        copy: {
            options: {},
            dist: {
                files: [
                    { expand: true, cwd: 'src/', src: ['icons/*', 'manifest.json'], dest: 'temp/' }
                ]
            }
        },
        crx: {
            dist: {
                src: 'temp/**/*',
                dest: 'dist/',
                zipDest: 'dist/',
                options: { privateKey: 'dev_key.pem' }
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-crx');
    grunt.loadNpmTasks('grunt-jscs');

    grunt.registerTask('dev', ['clean', 'jscs', 'jshint', 'copy', 'crx']);
    grunt.registerTask('dist', ['clean', 'jscs', 'jshint', 'babel', 'htmlmin', 'cssmin', 'uglify', 'copy', 'crx']);

    grunt.registerTask('default', ['dist']);
};
