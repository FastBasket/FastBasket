var fastBasket = angular.module('fastBasket', [
  'fastBasket.shop',
  'fastBasket.cart',
  'ngRoute']).
  config(function($routeProvider){
    $routeProvider
      .when('/store', {
        templateUrl: 'partial/shop.html',
        controller: 'shopcontroller'
      })
      .when('/products/:productSku', {
        templateUrl: 'partials/product.html'
      })
      .when('/cart', {
        templateUrl: 'partial/cart.html',
        controller: 'cartcontroller'
      })
      .when('/checkout', {
        templateUrl: 'partial/checkout.html'
        // controller: 'checkoutcontroller'
      })
      .otherwise({
        redirectTo: '/store'
      })
  })
  .controller('appcontroller', function($scope, Cart){
    $scope.cart = Cart.storage
  })

fastBasket.factory("Cart", function(){


  var basket = function(){
    this.store = {}
    this.total = 0
    this.size = 0
  }
  basket.prototype.addOneItem = function(item){
    this.store[item.name] ? this.store[item.name].count += 1 : this.store[item.name] = {count: 1, price: item.price, name: item.name}
    this.total += Number(item.price)
    this.size++
  }
  basket.prototype.removeOneItem = function(item){
    if(this.store[item.name].count > 1){
      this.store[item.name].count -= 1
      this.total -= Number(item.price)
      this.size--
    }
    else if (this.store[item.name].count == 1){
      delete this.store[item.name]
      this.total -=  Number(item.price)
      this.size--
    }
  }
  basket.prototype.removeAllItem = function(item){
    this.total -=  Number(item.price) * this.store[item.name].count
    this.size -= this.store[item.name].count
    delete this.store[item.name]
  }
  basket.prototype.clearAll = function(){
    this.store = {}
    this.total = 0
    this.size = 0
  }

  userBasket = new basket()

  return {
    storage: userBasket
  }

})
