angular.module('fastBasket.searchBar', [])
.controller('searchBarController', function($scope, $http, $rootScope, $state){

  $scope.checkout = function(){
    var request = {
      total: 0,
      productIds: [],
      shippingAddress: "55 9th St. 94103, San Francisco CA",
      userId: "4",
      storeId: "1"
    };

    for (var i=0; i<$rootScope.shopCart.length; i++){
      request.total +=  parseInt($rootScope.shopCart[i].price, 10);
      request.productIds.push($rootScope.shopCart[i].dbId);
    }

    $http({
      method: "POST",
      url: '/api/product/checkout',
      data: request
    })
    .then(function(result){
      console.log(result.data);
    });
  };

  function elasticSearch(text){
    return $http({
      method: 'GET',
      url: '/api/product/search/' + text
    })
    .then(function(result){
      return result.data;
    });
  }

  this.querySearch = function(text){
    if (text && text.trim() !== ''){
      return elasticSearch(text);
    } else {
      return [];
    }
  };
  
  this.searchTextChange = function(text){
    if (text && text.trim() !== ''){
      return elasticSearch(text);
    } else {
      return [];
    }
  };

  this.selectedItemChange = function(item){
    if (item && item.name.trim() !== ''){
      $http({
        method: 'GET',
        url: '/api/product/showResults/' + item.name
      })
      .then(function(products){
        $rootScope.products = products.data;
      });
    }
  };

  this.checkEnter = function($event){
    var keycode = $event.which || $event.KeyCode;
    if (keycode === 13){
      this.selectedItemChange({name: this.searchText});
    }
  };
});