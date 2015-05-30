'use strict';

var loadGruntTasks = require('load-grunt-tasks');
var webpack = require('webpack');


module.exports = function(grunt) {
    loadGruntTasks(grunt);

    grunt.initConfig({

        // Read configuration from package.json
        pkg: grunt.file.readJSON('package.json'),

        // banner
        banner:  '/*\n' +
                    ' <%= pkg.name %> v<%= pkg.version %>\n' +
                    ' <%= pkg.homepage %>\n' +
                    '*/\n',

        // https://github.com/gruntjs/grunt-contrib-clean
        clean: {
            common: [
                'dist/*',
                '!dist/*.txt'
            ]
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

        // webpack
        // http://babeljs.io/docs/using-babel/#webpack
        // https://github.com/webpack/grunt-webpack
        webpack: {
            // common
            options: {
                module: {
                    loaders: [
                        // https://github.com/babel/babel-loader
                        {test: /\.js$/, loader: 'babel'}
                    ]
                },
                plugins: [
                    // http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        }
                    }),
                    // http://webpack.github.io/docs/list-of-plugins.html#bannerplugin
                    new webpack.BannerPlugin('<%= banner %>', {
                        entryOnly: true,
                        raw: true
                    })
                ]
            },
            // recursive-iterator
            iterator: {
                entry: {
                    'recursive-iterator': './src/RecursiveIterator.js'
                },
                output: {
                    path: './dist/',
                    filename: '[name].min.js',
                    library: 'RecursiveIterator',
                    libraryTarget: 'umd'
                },
                devtool: 'source-map',
                debug: true
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
                    'dist/recursive-iterator.min.js',
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
        'clean', 'webpack', 'karma:phantom'
    ]);
};
