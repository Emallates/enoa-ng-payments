class payments {
  constructor($http, paypalConfig) {
    this.$http = $http;
    this.configs = paypalConfig;
  }
  pay(amount, currency, description) {
    return this.$http({
      method: 'POST',
      data: { amount, description },
      url: `${this.configs.base_url}/pay`,
    });
  }
  final(paymentId, token, PayerID) {
    return this.$http({
      method: 'POST',
      data: { paymentId, token, PayerID },
      url: `${this.configs.base_url}/pay`,
    })
  }
}

payments.$inject = ['$http', '$paypalconfigs'];

export default payments;
