describe('b-property', function () {
  var dom = {
    input : document.querySelector('view[name=page_b-property] input'),
    ul : document.querySelector('view[name=page_b-property] ul')
  }
  it('特性初始化', function (done) {
    b.views.goTo('page_b-property');
    b.run('page_b-property', function(require, $scope){
      $scope.$event = {
        switchi : function(){
          $scope.a.b.readonly = false;
          $scope.a.b.disable  = true;
        }
      }

      $scope.a = {
        b: {
          readonly: true,
          disable: false
        }
      };

      setTimeout(function(){
        expect(dom.input.hasAttribute('readonly')).toEqual(true);
        expect(dom.input.hasAttribute('disabled')).toEqual(false);

        setTimeout(function() {
          $scope.list = [
            {
              status: {
                readonly: true,
                disable: true
              }
            },
            {
              status: {
                readonly: false,
                disable: false
              }
            }
          ]

          setTimeout(function() {
            expect(dom.ul.querySelector('li:nth-child(1) input').readOnly).toEqual(true);
            expect(dom.ul.querySelector('li:nth-child(1) input').disabled).toEqual(true);
            expect(dom.ul.querySelector('li:nth-child(2) input').readOnly).toEqual(false);
            expect(dom.ul.querySelector('li:nth-child(2) input').disabled).toEqual(false);

            done();
          }, 18);

        }, 50);

      }, 18);
    });
  });

  it('切换特性', function(done){
    beacon(dom.input).once('click', function(){
      setTimeout(function(){
        expect(dom.input.hasAttribute('readonly')).toEqual(false);
        expect(dom.input.hasAttribute('disabled')).toEqual(true);
        done();
      }, 18);
    });

    beacon(dom.input).on('click');
  })

});
