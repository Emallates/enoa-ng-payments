// configs.provider.js
// angular.module('$paypal')
// .provider('$paypalConfigsProvider')

function paypalConfigProvider() {
  var BASE_URL = '/';

  this.set = function(url){
    BASE_URL = url;
  }

  function paypalConfigs(base_url) {
    this.base_url = base_url
  }

  this.$get = [function paypalConfigsFactory() {
    return new paypalConfigs(BASE_URL);
  }]
}

export default paypalConfigProvider;
