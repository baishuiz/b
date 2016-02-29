module.exports = function(grunt){
    grunt.initConfig({
        pkg:grunt.file.readJSON("package.json"),
        output : {
            fileName: '<%= pkg.name %>.<%= pkg.version %>.js',
            minFileName : '<%= pkg.name %>.<%= pkg.version %>.min.js'
        },
        connect: {
          server: {
            options: {
              port: 8000,
              base: './'
            }
          }
        },

        concat: {
            options: {
                separator: ';'
            }

           ,dist: {
                src : [
                        './libs/*.js',
                        './src/B/util/*.js',
                        './src/B/data/memCache.js',
                        './src/B/event/events.js',
                        './src/B/directive/event.js',
                        './src/B/scope/Scope.js',
                        './src/B/scope/scopeManager.js',
                        './src/B/network/http.js',
                        './src/B/service/Service.js',
                        './src/B/service/serviceFactory.js',
                        './src/B/router/router.js',
                        './src/B/view/View.js',
                        './src/B/view/viewManager.js',
                        './src/B/controller/run.js',



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
                specs: ['./test/spec/view/*Spec.js', './test/spec/scope/*Spec.js', './test/spec/service/*Spec.js', './test/spec/event/*Spec.js'],
                keepRunner: true,
                host: 'http://127.0.0.1:8000/',
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
                specs: ['./test/spec/view/*Spec.js', './test/spec/scope/*Spec.js', './test/spec/service/*Spec.js', './test/spec/event/*Spec.js'],
                keepRunner: true,
                host: 'http://127.0.0.1:8000/',
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

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['connect',  'concat', 'uglify', 'jasmine:mini']);
    grunt.registerTask('package', [ 'concat', 'uglify']);
    grunt.registerTask('debug', [ 'connect', 'concat', 'jasmine:pivotal']);
};
