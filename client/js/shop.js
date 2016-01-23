angular.module('fastBasket.shop', [])
  .controller('shopcontroller', function($scope, Cart){
    $scope.cart = Cart.storage;
    // $scope.produce = Store.produce;
//     [
//  {
//    "id": "1",
//    "name": "Beef",
//    "price": "24.30",
//    "storeid": 1
//  },
//  {
//    "id": "2",
//    "name": "Milk",
//    "price": "5.23",
//    "storeid": 1
//  },
//  {
//    "id": "3",
//    "name": "Bread",
//    "price": "3.99",
//    "storeid": 1
//  }
// ]

  });