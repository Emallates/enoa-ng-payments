
class addCard {
  constructor(stripeSource) {
    this.restrict = 'EA';
    this.stripeSource = stripeSource;
    this.scope = { source: '=', onSuccess: '&', onFail: '&' }
    this.template = '<div><button ng-click="save()">Save to Stripe</button></div>';
  }
  link($scope, iElm, iAttrs) {
    $scope.onFail = $scope.onFail || angular.noop;
    $scope.onSuccess = $scope.onSuccess || angular.noop;
    $scope.source.targetElement = $scope.source.targetElement;
    if (!$scope.source.targetElement) {
      $scope.source.targetElement = angular.element('<div>')[0];
      iElm.append($scope.source.targetElement)
    }
    $scope.save = () => {
      this.stripeSource.createCard($scope.source)
        .then(source => $scope.onSuccess({source}))
        .catch(error => $scope.onFail({error}))        
    }
  }
  static Factory(stripeSource) {
    return new addCard(stripeSource);
  }
}
addCard.Factory.$inject = ['stripeSource'];
export default addCard;
