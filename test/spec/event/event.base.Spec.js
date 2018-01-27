describe('事件绑定', function () {

  function dispatchEvent(dom, type) {
    var evt = document.createEvent('Event');
    evt.initEvent(type, true, true);
    dom.dispatchEvent(evt);
  }

  it('触发点击事件', function (done) {
    b.run('page_event', function(require, $scope){
      var dom ={
        btn: document.querySelector('view[name=page_event] .btn')
      }
      $scope.$event = {
        clickHandle: function(e, info) {
          expect(info).toEqual('Hello');
          Air.NS('helloEvent.event', $scope);
          $scope.helloEvent.event.msg = 'hi,event';
        },

        testHandle : function() {
          // Object.observe($scope.helloEvent.event, function(){
          //   expect(dom.btn.innerHTML).toEqual('hi,event2');
          //   done();
          // })

          $scope.helloEvent.event.msg = 'hi,event2';
          done();
        }
      };
      setTimeout(function(){
        dispatchEvent(dom.btn, 'click');

        setTimeout(function(){
          // dispatchEvent(dom.btn, 'click');
          // dispatchEvent(dom.btn, 'test');
          beacon(dom.btn).on('test');
        }, 0);

        // dispatchEvent(dom.btn, 'test');
        // beacon(dom.btn).on('test');
      }, 0);


    })
  });

  it('支持参数、scope标签参数', function (done) {
    b.run('page_event_param', function(require, $scope){
      $scope.scopeParam = ' World';
      $scope.hi = 'Hello' ;
      var dom ={
        btn: document.querySelector('view[name=page_event_param] .btn')
      }
      $scope.$event = {
        clickHandle: function(e, param1, param2, param3) {
          expect(param1 + param2).toEqual('Hello World');
          expect(param3).toEqual('Hello(World)');
          done();
        }
      };
      setTimeout(function(){
        dispatchEvent(dom.btn, 'click');
      }, 100);
    })
  });

  it('多事件绑定', function (done) {
    b.run('page_event_multiple', function(require, $scope){
      var dom ={
        btn: document.querySelector('view[name=page_event_multiple] .btn')
      }
      $scope.$event = {
        focusHandle: function(e, info) {
          expect(info).toEqual('focus');
        },
        clickHandle: function(e, info) {
          expect(info).toEqual('click');
          done();
        }
      };
      setTimeout(function(){
        dispatchEvent(dom.btn, 'focus');
        dispatchEvent(dom.btn, 'click');
      }, 0);
    })
  });

});
