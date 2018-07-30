describe('服务请求', function () {

  var ERROR_CODE = {
    parse: 1, // JSON 解析出错
    timeout: 2, // 超时
    network: 3, // 网络错误
    business: 4 // 业务错误（由中间件控制）
  }

  b.service.setConfig('default', {
    host: window.host + '/test/service/',
    method: 'GET',
    protocol: 'HTTP',
    header: {
      header: '',
      userToken: ''
    },
    path: '',
    params: null,
    expiredSecond: null,
    timeout: 0.5
  });

  b.service.set('service.roomModelSearchListOpenCity', {
      path: 'roomModelSearchListOpenCity.json',
      expiredSecond: 20,
      extend : 'default'
  });

  it('基础数据请求', function (done) {
    b.run('page_service', function(require, $scope){
      var cityListService = b.service.get('service.roomModelSearchListOpenCity', $scope);

      cityListService.query({
        a: 1,
        b: 2
      }, {
        successCallBack: function(data){
          expect(data.result[0].cityName).toEqual('上海');
          done();
        },
        errorCallBack: function(errorCode) {
          console.log(errorCode)
        }
      })
    });
  });

  it('数据请求后更新页面内容', function(done) {
    b.run('page_service_change', function(require, $scope){
      $scope.city = '北京';
      var cityListService = b.service.get('service.roomModelSearchListOpenCity', $scope);

      cityListService.query({
        a: 1,
        b: 2
      }, {
        successCallBack: function(data){
          var cityName = data.result[0].cityName;
          $scope.city = cityName;
          var cityDom = document.querySelector('view[name=page_service_change] .city');

          setTimeout(function(){
            expect(cityDom.innerText).toEqual('City = 上海');
            done();
          }, 50);
        },
        errorCallBack: function(errorCode) {
          console.log(errorCode)
        }
      });
    });
  });

  b.service.set('service.serviceCache', {
    path: 'serviceCache.json',
    expiredSecond: 1,
    extend : 'default'
  });

  it('服务缓存', function(done) {
    b.run('page_service_cache', function(require, $scope){
      var serviceCache = b.service.get('service.serviceCache', $scope);

      var query = function(params, callback, noCache) {
        serviceCache.query(params, {
          noCache: noCache,
          successCallBack: function(data, fromCache){
            callback(data, fromCache);
          },
          errorCallBack: function(errorCode) {
            console.log(errorCode)
          }
        });
      };

      // 第一次请求后记录缓存，并修改数据内容
      // 1
      query({ a: 2, b: 3}, function(data, fromCache) {
        expect(fromCache).toEqual(undefined);
        data.result.length = 0;

        // 第二次请求直接从缓存读取，并验证数据内容
        query({ a: 2, b: 3}, function(data, fromCache) {
          expect(fromCache).toEqual(true);
          expect(data.result.length).toEqual(14);
          expect(data.result[0].cityName).toEqual('上海');

          // 第三次修改参数后缓存失效，同时记录新缓存
          // 2
          query({ a: 3, b: 4}, function(data, fromCache) {
            expect(fromCache).toEqual(undefined);

            // 第四次过期后请求，不使用缓存，同时记录新缓存
            setTimeout(function() {
              // 3
              query({ a: 3, b: 4}, function(data, fromCache) {
                expect(fromCache).toEqual(undefined);

                // 第五次请求，使用缓存
                query({ a: 3, b: 4}, function(data, fromCache) {
                  expect(fromCache).toEqual(true);

                  // 第六次请求，强制不实用缓存
                  // 4
                  query({ a: 3, b: 4}, function(data, fromCache) {
                    expect(fromCache).toEqual(undefined);
                    done();
                  }, true);
                });
              });
            }, 1500);
          });
        });
      });
    });

  });

  b.service.set('service.serviceMiddleware1', {
    path: 'serviceMiddleware1.json',
    expiredSecond: 1,
    extend : 'default'
  });

  it('beforeQuery 中间件', function(done) {

    b.service.addMiddleware('beforeQuery', function(requestParam, next) {
      // beforeQuery 中间件验证：如果是 middleware1 服务，则修改请求为 middlerware2 的地址
      if (requestParam.url.indexOf('serviceMiddleware1.json') !== -1) {
        requestParam.url = requestParam.url.replace('serviceMiddleware1.json', 'serviceMiddleware2.json');
      }
      next();
    });

    b.run('page_service_middleware_before', function(require, $scope){
      var serviceMiddleware1 = b.service.get('service.serviceMiddleware1', $scope);

      serviceMiddleware1.query({
        a: 1,
        b: 2
      }, {
        noCache: true,
        successCallBack: function(data, fromCache){
          expect(data.result).toEqual(2);
          done();
        },
        errorCallBack: function(errorCode) {
          console.log(errorCode)
        }
      });
    });

  });

  it('afterQuery 中间件', function(done) {

    b.service.set('service.serviceMiddleware3', {
      path: 'serviceMiddleware3.json',
      expiredSecond: 1,
      extend : 'default'
    });

    b.service.addMiddleware('afterQuery', function(response, next) {
      var responseData = response.data || {};
      var isError = false;

      if (responseData.name === 'serviceMiddleware3') {
        isError = true;
      }

      next(isError);
    });

    b.run('page_service_middleware_after', function(require, $scope){
      var serviceMiddleware3 = b.service.get('service.serviceMiddleware3', $scope);

      serviceMiddleware3.query({
        a: 1,
        b: 2
      }, {
        noCache: true,
        successCallBack: function(data, fromCache){
          console.log(data);
        },
        errorCallBack: function(errorCode, data) {
          expect(errorCode).toEqual(ERROR_CODE.business);
          expect(data.result).toEqual(3);
          done();
        }
      });
    });

  });

  it('服务超时', function(done) {
    b.service.set('service.timeoutService', {
      path: 'http://127.0.0.1:8001/timeoutService.json',
      expiredSecond: 1,
      extend : 'default'
    });

    // 已在 connect 的中间件中将 timeoutService.json 延迟 1s

    b.run('page_service_timeout', function(require, $scope) {
      var timeoutService = b.service.get('service.timeoutService', $scope);

      timeoutService.query({
        a: 1,
        b: 2
      }, {
        noCache: true,
        successCallBack: function(data, fromCache){
          console.log('no timeout');
        },
        errorCallBack: function(errorCode) {  
          expect(errorCode).toEqual(ERROR_CODE.timeout);
          done();
        }
      });

    });

  });


  it('服务事件', function(done) {
    b.service.set('service.eventTest', {
      path: 'event.json',
      extend : 'default'
    });

    b.service.set('service.nullService', {
      path: 'nullService.json',
      extend : 'default'
    });

    b.run('page_service_event', function(require, $scope) {
      var eventService = b.service.get('service.eventTest', $scope);
      eventService.query({});
      eventService.on(eventService.EVENTS.SUCCESS, function(e, response){
          $scope.hot = {cities:response }
          // console.log(JSON.stringify($scope.hot))
          setTimeout(function(){
            var dom = document.querySelector('view[name=page_service_event]')
            // expect(dom.innerHTML).toEqual('上海');

            expect(dom.querySelectorAll('p').length).toEqual(3);
            expect(dom.querySelector('p:nth-child(1)').innerText.trim()).toEqual('上海');
            expect(dom.querySelector('p:nth-child(2)').innerText.trim()).toEqual('北京');
            expect(dom.querySelector('p:nth-child(3)').innerText.trim()).toEqual('广州');
            done();
          },1000)
      })

      var nullService = b.service.get('service.nullService', $scope);
      nullService.query({});
      eventService.on(eventService.EVENTS.ERROR, function(e, error, response){
          $scope.error = 'error'
          setTimeout(function(){
            var dom = document.querySelector('view[name=page_service_event] span')
            expect(dom.innerHTML).toEqual('error');
            done();
          },0)
      })
    });

  });


  it('服务队列', function(done) {
    b.service.set('service.queueService', {
      path: 'queueService.json',
      extend : 'default'
    });

    b.run('page_service_queue', function(require, $scope) {
      var queueService = b.service.get('service.queueService', $scope);

      var count = 0;
      queueService.query(null, {
        successCallBack: function() {
          count++;
          expect(count).toEqual(1);
        }
      });
      queueService.query(null, {
        successCallBack: function() {
          count++;
          expect(count).toEqual(2);
        }
      });
      queueService.query(null, {
        successCallBack: function() {
          count++;
          expect(count).toEqual(3);
          done();
        }
      });
    });

  });

});
