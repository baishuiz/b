describe('远程模板', function () {

    it('初始化', function (done) {
      // 模板 HTML 元素选择器
      var selector = {
        activeView : 'viewport[main=true] view[active=true]'
      }

      var activeView = b.views.getActive();
      beacon(activeView).once(activeView.events.onHide, function(e, data) {

        var toView = data.to;

        beacon(toView).once(toView.events.onShow, function(e) {
          // 模板 HTML元素引用
          var activeView  = document.querySelector(selector.activeView)

          var activeViewContent = activeView.querySelector('p')
          expect(activeViewContent.innerText).toEqual('hello remote page');
          done();
        });
      });

      b.views.goTo('remote_page_map');
    }); // view 初始化完成

    it('前进', function (done) {
      // 切换至列表页
      b.views.goTo('remote_page_list');

      var activeView = b.views.getActive();
      beacon(activeView).once(activeView.events.onHide, function(e, data) {
        var toView = data.to;
        beacon(toView).once(toView.events.onShow, function(e) {
          // 模板 HTML元素引用
          var activeView = b.views.getActive();
          var activeViewName = activeView.getViewName();
          expect(activeViewName).toEqual('remote_page_list');
          done();
        });
      });


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
          done();
        });
      });
    }); // 后退 完成

}); // 远程模板 over
