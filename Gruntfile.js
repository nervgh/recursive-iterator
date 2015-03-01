'use strict';


module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        // Read configuration from package.json
        pkg: grunt.file.readJSON('package.json'),

        // banner
        banner:  '/*\n' +
                    ' <%= pkg.name %> v<%= pkg.version %>\n' +
                    ' <%= pkg.homepage %>\n' +
                    '*/\n',

        // https://github.com/gruntjs/grunt-contrib-copy
        copy: {
            common: {
                files: [
                    {
                        src: './dist/recursive-iterator.umd.js',
                        dest: './dist/recursive-iterator.js'
                    },
                    {
                        src: './dist/recursive-iterator.min.umd.js',
                        dest: './dist/recursive-iterator.min.js'
                    }
                ]
            }
        },

        // https://github.com/gruntjs/grunt-contrib-clean
        clean: {
            common: [
                'dist/*',
                '!dist/*.txt'
            ],
            umd: [
                'dist/*.umd.js',
                '!dist/*.txt'
            ]
        },

        // https://github.com/bebraw/grunt-umd
        umd: {
            common: {
                src: 'dist/recursive-iterator.js',
                dest: 'dist/recursive-iterator.umd.js',
                objectToExport: 'RecursiveIterator',
                globalAlias: 'RecursiveIterator',
                amdModuleId: '<%= pkg.name %>',
                indent: 4
            }
        },

        // https://github.com/gruntjs/grunt-contrib-uglify
        uglify: {
            common: {
                src: 'dist/recursive-iterator.umd.js',
                dest: 'dist/recursive-iterator.min.umd.js',
                options: {
                    banner: '<%= banner %>'
                }
            }
        },

        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            common: {
                files: [
                    'src/**/*.js',
                    'test/**/*.js'
                ],
                tasks: ['default'],
                options: {
                    interrupt: true,
                    spawn: false
                }
            }
        },

        // https://github.com/babel/grunt-babel
        babel: {
            dist: {
                files: {
                    './dist/recursive-iterator.js': './src/RecursiveIterator.js'
                }
            }
        },

        // karma
        // https://github.com/karma-runner/grunt-karma
        karma: {
            options: {
                // base path that will be used to resolve all patterns (eg. files, exclude)
                basePath: '',
                // frameworks to use
                // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
                frameworks: ['jasmine'],
                // list of files / patterns to load in the browser
                // list of files to exclude
                exclude: [],
                // preprocess matching files before serving them to the browser
                // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
                preprocessors: {},
                // web server port
                port: 9876,
                // enable / disable colors in the output (reporters and logs)
                colors: true,
                //
                files: [
                    'dist/recursive-iterator.js',
                    'test/*.js'
                ],
                //
                plugins : [
                    'karma-jasmine',
                    'karma-phantomjs-launcher'
                ]
            },
            // http://karma-runner.github.io/0.12/config/configuration-file.html
            phantom: {
                // level of logging
                // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
                logLevel: 'INFO',
                // enable / disable watching file and executing tests whenever any file changes
                autoWatch: false,
                // start these browsers
                // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
                browsers: ['PhantomJS'],
                // Continuous Integration mode
                // if true, Karma captures browsers, runs the tests and exits
                singleRun: true
            }
        }

    });

    grunt.registerTask('default', [
        'clean:common', 'babel', 'umd', 'uglify', 'copy', 'clean:umd', 'karma:phantom'
    ]);
};
