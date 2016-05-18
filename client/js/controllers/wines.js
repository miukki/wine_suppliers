angular
  .module('app')
  .controller('AllWinesController', ['$scope', 'Product', function($scope,
      Product) {
    Product.find({
      filter: {
        include: [
          'winery',
          'type'
        ]
      }
    }).$promise.then(function(res){
      $scope.wines = res;
      console.log('$scope.wines', $scope.wines);
    });

  }]);
