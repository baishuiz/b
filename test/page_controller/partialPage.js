b.run('remote_page_map', function(require, $scope){

    $scope.$event = {
      partialViewEventTest : function(msg){
        $scope.eventMsg = msg;
      }
    };

});
