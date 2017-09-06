describe('repeat', function () {

  it('repeat with b-exist', function (done) {
    b.run('page_repeat_with_b-exist', function(require, $scope){
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
        listB: document.querySelector('view[name=page_repeat_with_b-exist]>.listB')
      }


      setTimeout(function(){
        expect(dom.listB.querySelectorAll('input').length).toEqual(1);

        // expect(dom.listB.querySelector('input:nth-child(1)').value.trim()).toEqual('T1');
        expect(dom.listB.querySelector('input').value.trim()).toEqual('T2');
        // expect(dom.listB.querySelector('input:nth-child(3)').value.trim()).toEqual('T3');

        done();

      }, 500);
    });
  });

  it('repeat sub element with b-exist', function (done) {
    b.run('page_repeat_subElement_with_b-exist', function(require, $scope){
      $scope.a = {
        b: {
          list :[
            {name: 'T1', status:true},
            {name: 'T2', status:0},
            {name: 'T3', status:2}
          ]
        }
      }



      setTimeout(function(){
        var dom = {
          listB: document.querySelectorAll('view[name=page_repeat_subElement_with_b-exist]>.listB')
        }

        
        // expect(dom.listB.length).toEqual(1);


        // expect(dom.listB[0].querySelector('input').value.trim()).toEqual('T1');
        expect(dom.listB[1].querySelector('input').value.trim()).toEqual('T2');
        // expect(dom.listB[1].querySelector('input').value.trim()).toEqual('T3');

        done();

      }, 500);
    });
  });


});
