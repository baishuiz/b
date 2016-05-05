// location.pathname = '/index/hello';
describe('模板内嵌 view ', function () {

  it('初始化', function () {
    // 修改url为主页
    history.replaceState(null, 'index', '/index/hello');

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
      var activeView  = document.querySelector(selector.activeView)
      var activeViewContent = activeView.querySelector('p')
      expect(activeViewContent.innerText).toEqual('Hello');
    });

  }); // view 初始化完成

  it('前进', function () {
    // 切换至列表页
    b.views.goTo('page_list');
    var activeView = b.views.getActive();
    var activeViewName = activeView.getViewName();
    expect(activeViewName).toEqual('page_list');
  });// 切换 完成


  it('后退', function (done) {
    b.views.goTo('page_list');
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

  it('路由参数', function(done) {
    b.views.goTo('page_list', {
      params: {
        city: 104
      },
      query: '?a=1&b=2'
    });
    expect(location.pathname + location.search).toEqual('/list/104?a=1&b=2');
    b.run('page_list', function(require, $scope){
      expect($scope.$request.params['city']).toEqual(104);
      done();
    });

  }); // 路由参数 完成

  it('afterURLChange 中间件', function(done) {
    var changeSwitch = true;
    b.views.goTo('page_url_change_before');
    var changeCallback = function(changeObj, next){
      if (changeSwitch) {
        changeSwitch = false
        b.views.removeMiddleware('afterURLChange', changeCallback);
        next();

        // done 会截断后续 js 的执行，导致无法show page_url_change_after，所以用timeout
        setTimeout(function(){
          expect(changeObj.from).toEqual('http://' + window.host + '/page_url_change_before');
          expect(changeObj.to).toEqual('http://' + window.host + '/page_url_change_after');
          done();
        }, 0);
      } else {
        next();
      }
    }
    b.views.addMiddleware('afterURLChange', changeCallback);

    b.views.goTo('page_url_change_after');
    changeSwitch = false;

  });

}); // 模板内嵌 view over
