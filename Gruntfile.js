var fs = require('fs');
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
              base: './',
              useAvailablePort: true,
              middleware: function(connect, options, middlewares) {
                // inject a custom middleware into the array of default middlewares
                // this is likely the easiest way for other grunt plugins to
                // extend the behavior of grunt-contrib-connect
                middlewares.unshift(function(req, res, next) {
                  if (req.url.indexOf('timeoutService.json') !== -1){
                    setTimeout(function(){
                      var raw = fs.createReadStream('./test/service/timeoutService.json');
                      raw.pipe(res);
                    }, 1000);
                  } else {
                    return next();
                  }
                });

                return middlewares;
              }
            }
          }
        },

        concat: {
            options: {
                separator: ';'
            }

           ,web: {
                src : [
                        './libs/*.js',
                        './src/B/util/*.js',
                        './src/B/data/memCache.js',
                        './src/B/data/storage.js',
                        './src/B/event/events.js',
                        './src/B/directive/event.js',
                        './src/B/directive/show.js',
                        './src/B/directive/style.js',
                        './src/B/directive/property.js',
                        './src/B/directive/model.js',
                        './src/B/scope/Scope.js',
                        './src/B/scope/ScopeTreeManager.js',
                        './src/B/directive/Repeater.js',
                        './src/B/scope/tagManager.js',
                        './src/B/scope/scopeManager.js',
                        './src/B/network/http.js',
                        './src/B/service/Service.js',
                        './src/B/service/serviceFactory.js',
                        './src/B/router/router.js',
                        './src/B/view/View.js',
                        './src/B/view/viewManager.js',
                        './src/B/controller/run.js',
                        './src/B/TDK/TDK.js',

                        './src/B/*.js'
                      ],
                dest: './dist/web/<%= output.fileName %>'
            },

            hybrid: {
                src : [
                        './libs/*.js',
                        './src/B/util/*.js',
                        './src/B.Hybrid/bridge.js',
                        './src/B/data/memCache.js',
                        './src/B.Hybrid/data/storage.js',
                        './src/B/event/events.js',
                        './src/B/directive/event.js',
                        './src/B/directive/show.js',
                        './src/B/directive/property.js',
                        './src/B/directive/model.js',
                        './src/B/scope/Scope.js',
                        './src/B/directive/repeat.js',
                        './src/B/scope/scopeManager.js',
                        './src/B/network/http.js',
                        './src/B/service/Service.js',
                        './src/B/service/serviceFactory.js',
                        './src/B/router/router.js',
                        './src/B/view/View.js',
                        './src/B.Hybrid/view/viewManager.js',
                        './src/B/controller/run.js',
                        './src/B/TDK/TDK.js',

                        './src/B.Hybrid/b.js'
                      ],
                dest: './dist/hybrid/<%= output.fileName %>'
            }
        }

       ,jasmine: {
            pivotal: {
              src: './dist/web/<%=output.fileName %>',
              coverage: './dist/web/<%=output.fileName %>',
              options: {
                // '--web-security' : false,
                 '--local-to-remote-url-access' : true,
                // '--ignore-ssl-errors' : true,
                specs: [
                  './test/spec/view/*Spec.js',
                  './test/spec/scope/*Spec.js',
                  './test/spec/service/*Spec.js',
                  './test/spec/event/*Spec.js',
                  './test/spec/repeat/*Spec.js',
                  './test/spec/model/*Spec.js',
                  './test/spec/b-show/*Spec.js',
                  './test/spec/b-style/*Spec.js',
                  './test/spec/b-property/*Spec.js',
                  './test/spec/TDK/*Spec.js'
                ],
                keepRunner: true,
                host: 'http://127.0.0.1:8000/',
                vendor: ['node_modules/jasmine-ajax/lib/mock-ajax.js'],
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    template : 'test/template/DefaultRunner.tmpl',
                    coverage: 'bin/coverage/coverage.json',
                    report: 'bin/coverage',
                    files:'./dist/web/<%=output.fileName %>'
                }
              }
            }

           ,mini: {
              src: './dist/web/<%= output.minFileName %>',
              options: {
                template: 'test/template/DefaultRunner.tmpl',
                specs: [
                  './test/spec/view/*Spec.js',
                  './test/spec/scope/*Spec.js',
                  './test/spec/service/*Spec.js',
                  './test/spec/event/*Spec.js',
                  './test/spec/repeat/*Spec.js',
                  './test/spec/model/*Spec.js',
                  './test/spec/b-show/*Spec.js',
                  './test/spec/b-property/*Spec.js',
                  './test/spec/TDK/*Spec.js'
                ],
                keepRunner: true,
                host: 'http://127.0.0.1:8000/',
                vendor: ['node_modules/jasmine-ajax/lib/mock-ajax.js'],
              }
            }
        }
       ,uglify: {
          mini: {
            files: {
              './dist/web/<%= output.minFileName %>': ['./dist/web/<%= output.fileName %>'],
              './dist/hybrid/<%= output.minFileName %>': ['./dist/hybrid/<%= output.fileName %>']
            }
          }
        }
      ,jshint: {
        options: {
          curly: true,
          eqeqeq: true,
          eqnull: true,
          browser: true,
          globals: {
            jQuery: true
          },
        },
        uses_defaults: ['./dist/web/<%= output.fileName %>', './dist/hybrid/<%= output.fileName %>']//,
        // with_overrides: {
        //   options: {
        //     curly: false,
        //     undef: true,
        //   },
        //   files: {
        //     src: ['dir3/**/*.js', 'dir4/**/*.js']
        //   },
        // }
      }

    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['connect',  'concat', 'uglify', 'jasmine:mini']);
    grunt.registerTask('package', [ 'concat', 'uglify']);
    grunt.registerTask('debug', [ 'connect', 'concat', 'jasmine:pivotal']);
};
