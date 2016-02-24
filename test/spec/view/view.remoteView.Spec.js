// history.pushState = function(){location.hash = new Date()}
// history.replaceState = function(){location.hash = new Date()}
describe('远程模板', function () {

    it(' 初始化 ', function () {




      // 模板 HTML 元素选择器
      var selector = {
        activeView : 'viewport[main=true] view[active=true]'
      }

      b.views.goto('remote_page_map')

      // b.views.init('/remote_page_map');

      // 模板 HTML元素引用
      var activeView  = document.querySelector(selector.activeView)
      // expect(activeView).not.toBe(null);
      //
      var activeViewContent = activeView.querySelector('p')
      expect(activeViewContent.innerText).toEqual('Hello');

    }); // view 初始化完成

    // it('前进', function () {
    //   // 切换至列表页
    //   b.views.goto('remote_page_list');
    //   var activeView = b.views.getActive();
    //   var activeViewName = activeView.getAttribute('name');
    //   expect(activeViewName).toEqual('remote_page_list');
    // });// 切换 完成
    //
    // it('后退', function () {
    //   b.views.goto('remote_page_detail');
    //   b.views.back();
    //   // var mockPopstate = {state: {viewName:'remote_page_list'}}
    //   // beacon(window).on('popstate', mockPopstate);
    //   var activeView = b.views.getActive();
    //   var activeViewName = activeView.getAttribute('name');
    //   expect(activeViewName).toEqual('remote_page_list')
    // }); // 后退 完成

}); // 本地 view 初始化 over
