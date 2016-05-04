describe('b-property', function () {
  var dom = {
    input : document.querySelector('view[name=page_b-property] input')
  }
  it('特性初始化', function (done) {
    b.views.goTo('page_b-property');
    b.run('page_b-property', function(require, $scope){
      $scope.$event = {
        switchi : function(){
          $scope.readonly = false;
          $scope.disable  = true;
        }
      }

      $scope.readonly = true;
      $scope.disable  = false;

      setTimeout(function(){
        expect(dom.input.hasAttribute('readonly')).toEqual(true);
        expect(dom.input.hasAttribute('disabled')).toEqual(false);
        done();
      }, 0);
    });
  });

  it('切换特性', function(done){
    beacon(dom.input).once('click', function(){
      expect(dom.input.hasAttribute('readonly')).toEqual(false);
      expect(dom.input.hasAttribute('disabled')).toEqual(true);
      done();
    });

    beacon(dom.input).on('click');
  })

});
