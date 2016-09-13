describe('partialViw 事件绑定', function () {

  function dispatchEvent(dom, type) {
    var evt = document.createEvent('Event');
    evt.initEvent(type, true, true);
    dom.dispatchEvent(evt);
  }

  it('触发点击事件', function (done) {

    b.run('remote_page_partialTestA', function(require, $scope){
      $scope.pageName = 'testA';
      $scope.list = [
        {
          name: 'item1'
        },
        {
          name: 'item2'
        },
        {
          name: 'item3'
        }
      ];
    });

    b.run('remote_page_partialTestB', function(require, $scope){
      $scope.pageName = 'testB';
    });

    b.views.goTo('remote_page_partialTestA');
    b.run('partialPage', function(require, $scope){
      var dom ={
        btn: document.querySelector('view[b-scope-key=remote_page_partialTestA_partialPage] .partialBtn'),
        btnB: document.querySelector('view[b-scope-key=remote_page_partialTestB_partialPage] .partialBtn')
      }

      $scope.$event = {
        partialViewEventTest: function(e, msg) {
          $scope.eventMsg = msg;
          (msg === 'AOK') && expect(dom.btn.innerHTML).toEqual('testAAOK');
          (msg === 'BOK') && expect(dom.btnB.innerHTML).toEqual('testBBOK');
          done();
        }
      };
      setTimeout(function(){
        dispatchEvent(dom.btn, 'click');
        dispatchEvent(dom.btnB, 'click');
        dispatchEvent(dom.btn, 'click');
      }, 0);
      // beacon(dom.btn).on('click');


    })
  });

});
