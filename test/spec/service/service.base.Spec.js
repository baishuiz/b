describe('服务请求', function () {
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
        errorCallBack: function(xhr) {
          throw new Error(xhr);
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
          }, 0);
        },
        errorCallBack: function(xhr) {
          throw new Error(xhr);
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
          errorCallBack: function(xhr) {
            throw new Error(xhr);
          }
        });
      };

      // 第一次请求后记录缓存
      // 1
      query({ a: 2, b: 3}, function(data, fromCache) {
        expect(fromCache).toEqual(undefined);

        // 第二次请求直接从缓存读取
        query({ a: 2, b: 3}, function(data, fromCache) {
          expect(fromCache).toEqual(true);
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

    b.service.setMiddleware('beforeQuery', function(requestParam, next) {
      // beforeQuery 中间件验证：如果是 middleware1 服务，则修改请求为 middlerware2 的地址
      if (requestParam.url.indexOf('serviceMiddleware1.json')) {
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
        errorCallBack: function(data) {
          console.log(data);
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

    b.service.setMiddleware('afterQuery', function(responseData, next) {
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
        errorCallBack: function(data) {
          expect(data.result).toEqual(3);
          done();
        }
      });
    });

  });

});
