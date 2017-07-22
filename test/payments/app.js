/**
* app Module
*
* Description
*/
angular.module('app', ['ng-payments'])
.config(['stripeConfigProvider',function(stripeConfigProvider) {
  stripeConfigProvider.set({ apiKey: "pk_test_JXSZmnQt9e9mEdU8JKFJBs5S" })
}])
.controller('ctrl', ['$scope', 'stripeSource', function($scope, stripeSource){

  console.log(stripeSource);
  
  $scope.pMethod = {
    card: {
        number: '4000000000003063'
        // number: '378282246310005'
        , exp_year: "18"
        , exp_month: "12"
        , cvc: 123
      },
      targetElement: angular.element('#iframe')[0],
      redirect_url: `${window.location.href}/success.html`,
      billing_add: {
        name: 'test user',
        phone: '0521234567',
        address: {
          city: 'Dubai'
          , line1: 'Dubai add 1'
          , line2: 'Dubai add 2'
          , state: 'Dubai'
          , country: 'United Arab Emtares'
          , postal_code: 52250
        }
      }
    }

    $scope.onSuccess = R => console.log(R);
    $scope.onFail = Err => console.log(Err);

    // stripeSource.createCard($scope.pMethod)
    //   .then(
    //     R => console.log('Final', R),
    //     err => console.log('Final error', err)
    //   );
}])