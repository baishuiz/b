// location.pathname = '/index/hello';
describe('模板内嵌 view ', function () {

  it('初始化', function () {
    // 修改url为主页
    history.replaceState(null, 'index', '/index/hello');

    // 模板 HTML 元素选择器
    var selector = {
      activeView : 'viewport[main=true] view[active=true]'
    }
    var env = {
      $templatePath : 'http://' + window.host + '/test/page_template/',
      $resourceURL  : 'http://static.cjia.com/resource',
      $moduleURL    : '/libs/module'
    }

    b.init(env);

    // 模板 HTML元素引用
    var activeView  = document.querySelector(selector.activeView)
    var activeViewContent = activeView.querySelector('p')
    expect(activeViewContent.innerText).toEqual('Hello');

  }); // view 初始化完成

  it('前进', function () {
    // 切换至列表页
    b.views.goTo('page_list');
    var activeView = b.views.getActive();
    var activeViewName = activeView.getViewName();
    expect(activeViewName).toEqual('page_list');
  });// 切换 完成

  it('路由参数', function() {
    b.views.goTo('page_list', {
      params: {
        city: 104
      },
      query: '?a=1&b=2'
    });
    expect(location.pathname + location.search).toEqual('/list/104?a=1&b=2');
  }); // 路由参数 完成


  it('后退', function (done) {
    b.views.goTo('page_detail');
    b.views.back();

    var activeView = b.views.getActive();
    beacon(activeView).once(activeView.events.onHide, function(e, data) {
      var toView = data.to;
      beacon(toView).once(toView.events.onShow, function(e) {
        // 模板 HTML元素引用
        var activeView = b.views.getActive();
        var activeViewName = activeView.getViewName();
        expect(activeViewName).toEqual('page_list');
        done();
      });
    });
  }); // 后退 完成

}); // 模板内嵌 view over
