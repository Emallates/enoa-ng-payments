/**
* app Module
*
* Draft app
*/
angular.module('app', ['ui.router', 'ng-payments'])
// angular.module('app', ['ui.router', 'stripe'])
.controller('ctrl', ['$scope', function($scope){}])

.config(['stripeConfigProvider', '$stateProvider', function(stripeConfigProvider, $stateProvider) {
  stripeConfigProvider.set({ apiKey: "pk_test_JXSZmnQt9e9mEdU8JKFJBs5S" })
  
  var helloState = {
    name: 'paypal',
    url: '/paypal',
    controller: 'paypalCtrl',
    templateUrl: 'paypal.view.html'
  }

  var aboutState = {
    name: 'stripe',
    url: '/stripe',
    controller: 'stripeCtrl',
    templateUrl: 'stripe.view.html'
  }

  $stateProvider.state(helloState);
  $stateProvider.state(aboutState);
}])

