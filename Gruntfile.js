'use strict';


module.exports = function (grunt) {


    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);


    grunt.initConfig({

        yeoman: {
            app: 'app',
            dist: 'dist'
        },


        watch: {
            js: {
                files: ['{.tmp,<%= yeoman.app %>}/assets/js/{,*/}*.js'],
                tasks: ['newer:jshint:all']
            },

            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '<%= yeoman.app %>/assets/css/{,*/}*.css',
                    '.tmp/assets/css/{,*/}*.css',
                    '<%= yeoman.app %>/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp}'
                ],
                tasks: []
            }
        },

        connect: {
            options: {
                port: 8082,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '127.0.0.1',
                livereload: 35723
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    port: 8081,
                    hostname: '0.0.0.0',
                    base: '<%= yeoman.dist %>',
                    livereload: 35729
                }
            }
        },

        jshint: {
            options: {},
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/assets/js/{,*/}*.js'
            ],
            test: {
                options: {},
                src: ['test/spec/{,*/}*.js']
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'

                    ]
                }]
            },
            css: {
                files: [{
                    src: [
                        '<%= yeoman.dist %>/assets/css/*',
                        '!<%= yeoman.dist %>/assets/css/main.v.1.1.2.css'
                    ]
                }]
            }
        },


        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: 'dist'
            }
        },


        usemin: {
            html: ['<%= yeoman.dist %>/index.html']
        },

        imgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/assets/img',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/assets/img'
                }]
            }
        },

        htmlmin: {

            dist: {
                options: {

                    removeComments: true,
                    collapseWhitespace: true,

                    removeRedundantAttributes: true

                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['{,*/,**/,***/}**.html', '!*/**/rating.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        uglify: {
            options: {
                beautify: false,
                mangle: false
            },
            dist: {
                files: [


                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: ['{,*/}*.js'],
                        dest: '<%= yeoman.dist %>'
                    }

                ]
            }
        },


        copy: {
            main: {
                src: '<%= yeoman.app %>/index.html',
                dest: '<%= yeoman.dist %>/index.html'
            },
            dist: {
                expand: true,
                cwd: '<%= yeoman.app %>/',
                src: ['**', '!<%= yeoman.app %>/assets/css/{,*/}*.css'
                ],
                dest: '<%= yeoman.dist %>/'

            }
        },


        concurrent: {
            dist: [
                'htmlmin:dist',
                'cssmin:dist'
            ]
        },

        ngdocs: {
            all: ['<%= yeoman.app %>/common/api/**/*.js']
        }

    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            grunt.task.run(['connect:dist:keepalive']);
        } else {
            grunt.task.run([

                'connect:livereload',
                'watch'
            ]);
        }
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'connect:test'
    ]);

    grunt.registerTask('build', function () {
        grunt.task.run([
            'clean:dist',
            'copy:dist',

            'useminPrepare',
            'concat:generated',
            'cssmin:generated',
            'usemin',
            'htmlmin',
            'uglify',
            'clean:css'

        ]);
    });


    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};
