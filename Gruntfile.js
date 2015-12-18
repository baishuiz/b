module.exports = function(grunt){
    grunt.initConfig({
        pkg:grunt.file.readJSON("package.json"),
        output : {
            fileName: '<%= pkg.name %>.<%= pkg.version %>.js',
            minFileName : '<%= pkg.name %>.<%= pkg.version %>.min.js'
        },
        concat: {
            options: {
                separator: ';'
            }

           ,dist: {
                src : [
                        './libs/*.js',
                        './src/core/directive.js',
                        './src/core/event.js',
                        './src/core/config.js',
                        './src/core/network/request.js',

                        './src/utility/*.js',

                        './src/core/router.js',

                        './src/directive/event.js',
                        './src/directive/model.js',

                        './src/core/scope.js',
                        './src/core/scopeList.js',
                        './src/directive/repeat.js',
                        './src/core/scopeTree.js',
                        './src/core/url.js',
                        './src/core/viewManager.js',
                        './src/core/views.js',
                        './src/core/service.js',
                        './src/core/run.js',

                        './src/*.js'
                      ],
                dest: './dist/<%= output.fileName %>'
            }
        }

       ,jasmine: {
            pivotal: {
              src: './dist/<%=output.fileName %>',
              coverage: './dist/<%=output.fileName %>',
              options: {
                // '--web-security' : false,
                // '--local-to-remote-url-access' : true,
                // '--ignore-ssl-errors' : true,
                specs: './test/spec/*Spec.js',
                keepRunner: true,
                //host: 'http://127.0.0.1:8808/',
                vendor: ['node_modules/jasmine-ajax/lib/mock-ajax.js'],
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    template : 'test/template/DefaultRunner.tmpl',
                    coverage: 'bin/coverage/coverage.json',
                    report: 'bin/coverage',
                    files:'./dist/<%=output.fileName %>'
                }
              }
            }

           ,mini: {
              src: './dist/<%= output.minFileName %>',
              options: {
                template: 'test/template/DefaultRunner.tmpl',
                specs: './test/spec/*Spec.js',
                keepRunner:true,
                vendor: ['node_modules/jasmine-ajax/lib/mock-ajax.js'],
              }
            }
        }
       ,uglify: {
          mini: {
            files: {
              './dist/<%= output.minFileName %>': ['./dist/<%= output.fileName %>']
            }
          }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', [ 'concat', 'uglify', 'jasmine']);
    grunt.registerTask('package', [ 'concat', 'uglify']);
    grunt.registerTask('debug', [ 'concat', 'jasmine:pivotal']);
};
