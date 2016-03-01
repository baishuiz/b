describe('repeat', function () {

  it('repeat 基础', function (done) {
    b.run('page_repeat', function(require, $scope){
      $scope.list = [
        {
          name: 'Name 1'
        },
        {
          name: 'Name 2'
        },
        {
          name: 'Name 3'
        }
      ];

      var dom = {
        list : document.querySelector('view[name=page_repeat]>ul')
      }

      setTimeout(function(){
        expect(dom.list.querySelectorAll('li').length).toEqual(3);
        expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('Name 3');
        done();
      }, 0);
    });
  });

});
