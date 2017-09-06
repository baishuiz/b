describe('repeat', function () {

  it('repeat with b-show', function (done) {
    b.run('page_repeat_with_b-show', function(require, $scope){
      $scope.a = {
        b: {
          list :[
            {name: 'T1', status:true},
            {name: 'T2', status:0},
            {name: 'T3', status:2}
          ]
        }
      }

      var dom = {
        listB: document.querySelector('view[name=page_repeat_with_b-show]>.listB')
      }


      setTimeout(function(){
        expect(dom.listB.querySelectorAll('input').length).toEqual(3);
        expect(window.getComputedStyle(dom.listB.querySelector('input:nth-child(3)'))['display']).toEqual('inline-block');
        expect(window.getComputedStyle(dom.listB.querySelector('input:nth-child(2)'))['display']).toEqual('none');
        expect(window.getComputedStyle(dom.listB.querySelector('input:nth-child(1)'))['display']).toEqual('inline-block');

        expect(dom.listB.querySelector('input:nth-child(1)').value.trim()).toEqual('T1');
        expect(dom.listB.querySelector('input:nth-child(2)').value.trim()).toEqual('T2');
        expect(dom.listB.querySelector('input:nth-child(3)').value.trim()).toEqual('T3');

        done();

      }, 500);
    });
  });

  it('repeat sub element with b-show', function (done) {
    b.run('page_repeat_subElement_with_b-show', function(require, $scope){
      $scope.a = {
        b: {
          list :[
            {name: 'T1', status:true},
            {name: 'T2', status:0},
            {name: 'T3', status:2}
          ]
        }
      }

      var dom = {
        listB: document.querySelectorAll('view[name=page_repeat_subElement_with_b-show]>.listB')
      }


      setTimeout(function(){
        expect(dom.listB.length).toEqual(3);
        expect(window.getComputedStyle(dom.listB[2].querySelector('input'))['display']).toEqual('inline-block');
        expect(window.getComputedStyle(dom.listB[1].querySelector('input'))['display']).toEqual('none');
        expect(window.getComputedStyle(dom.listB[0].querySelector('input'))['display']).toEqual('inline-block');

        expect(dom.listB[0].querySelector('input').value.trim()).toEqual('T1');
        expect(dom.listB[1].querySelector('input').value.trim()).toEqual('T2');
        expect(dom.listB[2].querySelector('input').value.trim()).toEqual('T3');

        done();

      }, 500);
    });
  });


});
