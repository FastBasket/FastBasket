angular.module('fastBasket.searchBar', [])
.controller('searchBarController', function($scope, $http, $rootScope, $state){

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