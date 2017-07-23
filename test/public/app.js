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
  
  var paypalState = {
    name: 'paypal',
    url: '/paypal',
    controller: 'paypalCtrl',
    templateUrl: 'paypal.view.html'
  }
  var paypalPaymentState = {
    name: 'paypal.payment',
    url: '/:status?paymentId&token&PayerID',
    controller: 'paymentViewCtrl',
    templateUrl: 'paypal.payment.view.html'
  }

  var stripeState = {
    name: 'stripe',
    url: '/stripe',
    controller: 'stripeCtrl',
    templateUrl: 'stripe.view.html'
  }

  $stateProvider.state(paypalState);
  $stateProvider.state(paypalPaymentState);
  $stateProvider.state(stripeState);
}])

