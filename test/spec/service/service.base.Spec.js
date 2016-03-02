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
      expiredSecond: 0.5,
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

  it('服务缓存', function(done) {
    b.run('page_service_cache', function(require, $scope){
      var cityListService = b.service.get('service.roomModelSearchListOpenCity', $scope);

      var query = function(params, callback, noCache) {
        cityListService.query(params, {
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
      query({ a: 2, b: 3}, function(data, fromCache) {
        expect(fromCache).toEqual(undefined);

        // 第二次请求直接从缓存读取
        query({ a: 2, b: 3}, function(data, fromCache) {
          expect(fromCache).toEqual(true);
          expect(data.result[0].cityName).toEqual('上海');

          // 第三次修改参数后缓存失效，同时记录新缓存
          query({ a: 3, b: 4}, function(data, fromCache) {
            expect(fromCache).toEqual(undefined);

            // 第四次3秒后请求，此时缓存已过期
            setTimeout(function() {
              query({ a: 3, b: 4}, function(data, fromCache) {
                expect(fromCache).toEqual(undefined);

                // 第五次不使用缓存
                query({ a: 3, b: 4}, function(data, fromCache) {
                  expect(fromCache).toEqual(undefined);
                  done();
                }, true);
              });
            }, 1500);
          });
        });
      });
    });

  });

});
