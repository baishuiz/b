describe('远程模板', function () {

  var loadingstate;
   var loadingTest = {
     show : function(){
       loadingstate = "active"
     },

     hide : function(){
       loadingstate = "hide"
     }
   }
    b.views.loading.setLoading(loadingTest);

  it('初始化', function (done) {
    // 模板 HTML 元素选择器
    var activeView = b.views.getActive();
    beacon(activeView).once(activeView.events.onHide, function(e, data) {

      var toView = data.to;

      beacon(toView).once(toView.events.onShow, function(e) {
        // 模板 HTML元素引用
        var activeView = b.views.getActive().getDom();

        var activeViewContent = activeView.querySelector('p')
        var img = activeView.querySelector('img');
        expect(activeViewContent.innerText).toEqual('hello remote page');
        expect(img.src).toEqual('http://image.cjia.com/roommodel%2F4x3%2F801.jpg');
        expect(loadingstate).toEqual('active');

        done();
      });
    });

    b.views.goTo('remote_page_map');
  }); // view 初始化完成



  it('前进', function (done) {




    // 切换至列表页
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

    // 1
    b.views.goTo('remote_page_list');

    setTimeout(function(){
      // 4
      b.run('remote_page_list', function(require, $scope) {
        var activeView = b.views.getActive();

        var cityListService = b.service.get('service.roomModelSearchListOpenCity', $scope);
        cityListService.query({
          a: 1,
          b: 2
        }, {
          noCache: true,
          successCallBack: function(data){
          },
          errorCallBack: function(errorCode) {
            // console.log(errorCode)
          }
        })


        // 5
        beacon(activeView).on(activeView.events.onShow, function(e) {
          // 模板 HTML元素引用
          var activeView = b.views.getActive();
          var activeViewName = activeView.getViewName();
          expect(activeViewName).toEqual('remote_page_list');
          done();
        });
      });
    }, 500);


  });// 切换 完成

  it('后退', function (done) {

    b.views.back();

    var activeView = b.views.getActive();
    beacon(activeView).once(activeView.events.onHide, function(e, data) {
      var toView = data.to;
      beacon(toView).once(toView.events.onShow, function(e) {
        // 模板 HTML元素引用
        var activeView = b.views.getActive();
        var activeViewName = activeView.getViewName();
        expect(activeViewName).toEqual('remote_page_map');
        expect(loadingstate).toEqual('hide');
        done();
      });
    });
  }); // 后退 完成


  it('beforeGoTo 中间件', function(done) {
    var goToMiddewareParamResult;

    // 中间件1
    b.views.addMiddleware('beforeGoTo', function(paramObj, next) {
      if (paramObj.viewName === 'remote_page_view_middleware_1') {
        goToMiddewareParamResult = paramObj.options.toLocation;
        b.views.goTo('remote_page_view_middleware_2');
      } else {
        next();
      }
    });
    // 中间件2
    b.views.addMiddleware('beforeGoTo', function(paramObj, next) {
      if (paramObj.viewName === 'remote_page_view_middleware_3') {
        b.views.goTo('remote_page_view_middleware_4');
      } else {
        next();
      }
    });

    b.views.goTo('remote_page_view_middleware_1', {toLocation:'123'});

    // 1：监听 remote_page_map 的 onHide
    var activeView = b.views.getActive();
    beacon(activeView).once(activeView.events.onHide, function(e) {
      var activeView = b.views.getActive();
      // 2: 中间件 1 将 middlerware_1 拦截，跳转到了 middleware_2
      expect(activeView.getViewName()).toEqual('remote_page_view_middleware_2');
      expect(goToMiddewareParamResult).toEqual('123');

      // 3: 监听 middleware_2 的 onHide
      beacon(activeView).once(activeView.events.onHide, function(e) {
        var activeView = b.views.getActive();
        // 4: middlerware_2 的 controller 跳转到了 middleware_3
        // 5: 中间件 2 将 middlerware_3 拦截，跳转到了 middleware_4
        expect(activeView.getViewName()).toEqual('remote_page_view_middleware_4');
        done();
      });
    });

  });

}); // 远程模板 over
