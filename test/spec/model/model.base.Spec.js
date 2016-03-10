describe('model', function () {

  it("绑定输入控件", function(done){

    b.views.goTo('page_model_bind');
    b.run('page_model_bind', function(require, $scope) {
      $scope.username = ' 123';
      var dom = {
        username : document.querySelector('view[name=page_model_bind] .username')
      }

      setTimeout(function(){
        expect(dom.username.value).toEqual('123');
        done();
      }, 0);

    });

  });

  it("输入文字", function(done){

    b.views.goTo('page_model_input');
    b.run('page_model_input', function(require, $scope) {
      $scope.$event = {
        inputHandle : function(){console.log('hello')}
      }

      // scope 赋值
      $scope.username = '123';
      var dom = {
        username : document.querySelector('view[name=page_model_input] .username')
      }

      // 等待 view 更新
      setTimeout(function(){
        // 直接修改 dom 值，并触发 input 事件
        dom.username.value = ' 4 56 ';
        beacon(dom.username).on('input');

        // 等待 view 更新
        setTimeout(function(){
          // 验证
          expect($scope.username).toEqual('4 56');
          done();
        }, 0);

      }, 0);

    });

  });

});
