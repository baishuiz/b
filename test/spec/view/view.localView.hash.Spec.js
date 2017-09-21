// location.pathname = '/index/hello';
describe('模板内嵌 view ', function () {

  it('包含hash值的初始化', function (done) {
    // 修改url为主页
    history.replaceState(null, 'index', '/index/hello#hash1');

    b.ready(function(){
      // 模板 HTML 元素选择器
      var selector = {
        activeView : 'viewport[main=true] view[active=true]'
      }
      var env = {
        $templatePath : 'http://' + window.host + '/test/page_template/',
        $resourceURL  : '/test/page_controller/',
        $imageURL     : 'http://image.cjia.com/',
        $moduleURL    : '/libs/module'
      }

      b.init(env);

      // 模板 HTML元素引用
      expect(location.pathname).toEqual('/index/hello');
      expect(location.hash).toEqual('#hash1');
      done();
    });

  }); // view 初始化完成

  it('前进', function () {
    // 切换至列表页
    b.views.goTo('page_list_hash', {
      hash: '#hash2'
    });
    var activeView = b.views.getActive();
    var activeViewName = activeView.getViewName();

    expect(activeViewName).toEqual('page_list_hash');
    expect(location.hash).toEqual('#hash2');
  });// 切换 完成


  it('后退', function (done) {

    var onShowTriggeredNum = 0;
    var activeView = b.views.getActive();
    beacon(activeView).once(activeView.events.onHide, function(e, data) {

      beacon(window).on('hashchange', function () {
        if (location.hash === '#hash3') {
          history.back();
        } else {
          setTimeout(function () {
            done();
          }, 0);
        }
      });

      var toView = data.to;
      beacon(toView).on(toView.events.onShow, function(e) {
        onShowTriggeredNum++;
        if (onShowTriggeredNum <= 1) {
          location.hash = 'hash3';
        }
        expect(onShowTriggeredNum).toEqual(1);
      });
    });
    b.views.goTo('page_detail_hash');

  }); // 后退 完成

  // it('路由参数', function(done) {
  //   b.views.goTo('page_list_hash', {
  //     params: {
  //       city: 104
  //     },
  //     query: '?a=1&b=2',
  //     hash: '#hash4'
  //   });
  //   expect(location.pathname + location.search + location.hash).toEqual('/list/104?a=1&b=2#hash4');
  //   b.run('page_list_hash', function(require, $scope){
  //     expect($scope.$request.params['city']).toEqual(104);
  //     expect(location.hash).toEqual('#hash4');
  //     done();
  //   });

  // }); // 路由参数 完成

}); // 模板内嵌 view over
