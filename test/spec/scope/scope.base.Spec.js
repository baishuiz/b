describe('数据绑定', function () {

    it('本地模板渲染', function (done) {
      b.run('page_default', function(require, $scope){
        $scope.flower = 'sun';
        var dom = {
          flower : document.querySelector('view[name=page_default] .flower')
        }
        setTimeout(function(){
          expect(dom.flower.innerText).toEqual('sun');
          done();
        }, 0);
      })
    });

    it('scope 属性', function (done) {
      b.run('page_list', function(require, $scope){
        $scope.flower = 'list sun';
        $scope.attr = 'hello';
        var dom = {
          flower : document.querySelector('view[name=page_list] .flower')
        }
        setTimeout(function(){
          expect(dom.flower.getAttribute('attr')).toEqual('hello');
          done();
        }, 0);
      })
    });

    it('远程模板渲染', function (done) {
      var activeView = b.views.getActive();
      beacon(activeView).once(activeView.events.onHide, function(e, data) {
        var toView = data.to;

        beacon(toView).once(toView.events.onShow, function(e) {
          b.run('remote_page_scope', function(require, $scope){
            $scope.city = '铁岭';
            var dom = {
              city : document.querySelector('view[name=remote_page_scope] .city')
            }

            setTimeout(function(){
              expect(dom.city.innerText).toEqual('铁岭');
              done();
            }, 0);
          })
        });
      });

      b.views.goTo('remote_page_scope');
    });

    it('scope 作用域', function (done) {
      b.run('page_detail', function(require, $scope){
        $scope.parentValue = 'p';
      });

      b.run('page_detail_subview', function(require, $scope){
        $scope.subValue = 's';
        var dom = {
          text : document.querySelector('view[name=page_detail_subview] .text')
        }

        setTimeout(function(){
          expect(dom.text.innerText).toEqual('p - s');
          done();
        }, 0);
      });
    });

});
