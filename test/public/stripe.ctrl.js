angular.module('app')
.controller('stripeCtrl', ['stripeSource', '$stateParams', '$scope', function(stripeSource, $stateParams, $scope){

  const card = {
    number: '4000000000003063'
      // number: '378282246310005'
      , exp_year: "18"
      , exp_month: "12"
      , cvc: 123
  };
  const add = {
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
  };
  
  $scope.pMethodSource = {
    card,
    billing_add: add,
    targetElement: angular.element('#3d-frame')[0],
    redirect_url: `${window.location.href}/success.html`,
  }
  $scope.pMethod = {
    card,
    billing_add: add,
    redirect_url: `${window.location.href}/success.html`,
  }

  /* Directive listners */
  $scope.onSuccess = R => console.log(R);
  $scope.onFail = Err => console.log(Err);

  
  /* Source listners */

  $scope.save = function () {
    $scope.frame = true;
    stripeSource.createCard($scope.pMethodSource)
      .then( R => console.log('addCard success', R))
      .catch( Err => console.log('addCard fail', Err))
  }



}])