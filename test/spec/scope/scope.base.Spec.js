describe('数据绑定', function () {

    it('本地模板渲染', function (done) {
      b.run('page_default', function(require, $scope){
        $scope.flower = 'sun';
        $scope.cityTL = 'tieling'
        $scope.citySH = 'shanghai'
        var dom = {
          flower : document.querySelector('view[name=page_default] .flower'),
          flower_A : document.querySelector('view[name=page_default] .flower_A'),
          flower_B : document.querySelector('view[name=page_default] .flower_B')
        }
        setTimeout(function(){
          expect(dom.flower.innerText).toEqual('sun');
          expect(dom.flower_A.innerText).toEqual('shanghai');
          expect(dom.flower_B.innerText).toEqual('tie ling');
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
        }, 50);
      })
    });

    it('远程模板渲染', function (done) {

      b.views.goTo('remote_page_scope');

      setTimeout(function(){
        b.run('remote_page_scope', function(require, $scope){
          var activeView = b.views.getActive();

          var dom = {
            city : document.querySelector('view[name=remote_page_scope] .city')
          }

          // TODO
          var cityListService = b.service.get('service.roomModelSearchListOpenCity', $scope);
          cityListService.query({
            a: 1,
            b: 2
          }, {
            successCallBack: function(data){
              // console.log("******* success")
            },
            errorCallBack: function(errorCode) {
               console.log("************* error")
            }
          });

          beacon(activeView).on(activeView.events.onShow, function(e) {
            expect(dom.city.innerText).toEqual('铁岭');
            done();
          });

          $scope.city = '铁岭';

        });
      }, 500);

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
          expect($scope.$resourceURL).toEqual('/test/page_controller/');
          done();
        }, 0);
      });
    });

});
