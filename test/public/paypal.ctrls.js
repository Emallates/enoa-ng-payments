/**
* app Module
*
* Description
*/
angular.module('app')
.config(['$paypalconfigsProvider',  function($paypalconfigsProvider) {
  $paypalconfigsProvider.set('/paypal')
}])
.controller('paypalCtrl', ['$scope', 'paypalPayments', '$stateParams', '$window', function($scope, paypalPayments, $stateParams, $window){
  $scope.user = { currency: 'SGD' };
  $scope.payment = { amount: '200' };

  $scope.pay = function () {
    paypalPayments.pay(
      $scope.payment.amount,
      //$scope.user.currency,
      //`Plan title ${Math.random()}` // Snoopyo.com payment 
    ).then(R => {
      // $window.open(R.data.link);
      $window.location.href = R.data.link;
    })
    .catch(console.log)
  }

}])
.controller('paymentViewCtrl', ['$stateParams', 'paypalPayments', '$scope', function ($stateParams, paypalPayments, $scope) {
  console.log($stateParams, paypalPayments)
}])