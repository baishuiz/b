describe('model', function () {

  it("绑定输入控件", function(done){

    b.views.goTo('page_model_bind');
    b.run('page_model_bind', function(require, $scope) {
      $scope.username = '123';
      $scope.checked= true;
      var dom = {
        username : document.querySelector('view[name=page_model_bind] .username'),
        checkbox : document.querySelector('view[name=page_model_bind] .checkbox')
      }

      setTimeout(function(){
        expect(dom.username.value).toEqual('123');
        expect(dom.checkbox.checked).toEqual(true);
        done();
      }, 0);

    });

  });

  it("输入文字", function(done){

    b.views.goTo('page_model_input');
    b.run('page_model_input', function(require, $scope) {
      $scope.$event = {
        inputHandle : function(){}
      }

      // scope 赋值
      $scope.username = '123';
      var dom = {
        username : document.querySelector('view[name=page_model_input] .username')
      }

      // 等待 view 更新
      setTimeout(function(){
        // 直接修改 dom 值，并触发 input 事件
        dom.username.value = '4 56';
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



  it("更改 checkbox 状态", function(done){

    b.views.goTo('page_model_checkbox');
    b.run('page_model_checkbox', function(require, $scope) {
      $scope.$event = {
        clickHandle : function(){

        }
      }

      // scope 赋值
      $scope.check = true;
      var dom = {
        checktest : document.querySelector('view[name=page_model_checkbox] .checktest')
      }

      setTimeout(function(){
        dom.checktest.checked = false;
        beacon(dom.checktest).on('change');
        // 等待 view 更新
        setTimeout(function(){
          // 验证
          expect($scope.check).toEqual(false);
          done();
        }, 0);
      },0)

    });

  });


  it("同名 checkbox 绑定数组", function(done){

    b.views.goTo('page_model_checkboxGroup');
    b.run('page_model_checkboxGroup', function(require, $scope) {
      $scope.$event = {
        clickHandle : function(){

        }
      }

      // scope 赋值
      $scope.checks = ['2', '4'];
      var dom = {
        checktest : document.querySelectorAll('view[name=page_model_checkboxGroup] .checktest'),
        checktestB : document.querySelectorAll('view[name=page_model_checkboxGroup] .checktestB')
      }


      expect(dom.checktest[0].checked).toEqual(false);
      expect(dom.checktest[1].checked).toEqual(true);
      expect(dom.checktest[2].checked).toEqual(false);
      expect(dom.checktest[3].checked).toEqual(true);

      // 更换数组 length 不变
      $scope.checks = ['1', '3'];
      expect(dom.checktest[0].checked).toEqual(true);
      expect(dom.checktest[1].checked).toEqual(false);
      expect(dom.checktest[2].checked).toEqual(true);
      expect(dom.checktest[3].checked).toEqual(false);

      // 更换数组 length 变长
      $scope.checks = ['1', '3', '4'];
      expect(dom.checktest[0].checked).toEqual(true);
      expect(dom.checktest[1].checked).toEqual(false);
      expect(dom.checktest[2].checked).toEqual(true);
      expect(dom.checktest[3].checked).toEqual(true);

      // 更换数组 length 变短
      $scope.checks = ['2'];
      expect(dom.checktest[0].checked).toEqual(false);
      expect(dom.checktest[1].checked).toEqual(true);
      expect(dom.checktest[2].checked).toEqual(false);
      expect(dom.checktest[3].checked).toEqual(false);
      $scope.checks = [];
      expect(dom.checktest[0].checked).toEqual(false);
      expect(dom.checktest[1].checked).toEqual(false);
      expect(dom.checktest[2].checked).toEqual(false);
      expect(dom.checktest[3].checked).toEqual(false);

      // 通过数组方法变更数据
      $scope.checksB = [];
      $scope.checksB.push('a1');
      $scope.checksB.unshift('a3');

      dom.checktest[0].checked = true;
      beacon(dom.checktest[0]).on('change');

      setTimeout(function(){
        expect(dom.checktest[0].checked).toEqual(true);
        expect(dom.checktestB[0].checked).toEqual(true);
        expect(dom.checktestB[1].checked).toEqual(false);
        expect(dom.checktestB[2].checked).toEqual(true);
        expect(dom.checktestB[3].checked).toEqual(false);
        done();
      },0)


    });

  });



});
