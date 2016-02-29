describe('服务请求', function () {
  b.service.setConfig('default', {
    host: '127.0.0.1:8000/test/service/',
    method: 'GET',
    protocol: 'HTTP',
    header: {
      header: '',
      userToken: ''
    },
    path: '',
    params: null,
    expiredTime: null,
  });

  b.service.set('service.roomModelSearchListOpenCity', {
      path: 'roomModelSearchListOpenCity.json',
      expiredTime: 60 * 60 *24,
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
      })
    });
  });

});
