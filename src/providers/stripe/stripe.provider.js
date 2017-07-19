/**
 * @todo Improve this code
 */

function stripeConfigProvider() {
  var API_KEY = false;
  var BASE_URL = 'https://api.stripe.com/v1'
  var DEFAULTS = {
    add_card_amount: 100,
    currency: 'usd',
    redirect: null
  }

  this.set = (configs, defaults) => {
    API_KEY = configs.apiKey;
    if (configs.baseUrl) BASE_URL = configs.baseUrl;
    DEFAULTS = angular.extend({}, DEFAULTS, defaults);
  };

  function stripeConfig(key, base_url, defaults) {
    this.key = key;
    this.base_url = base_url;
    this.defaults = defaults;
  }

  this.$get = [function stripeConfigFactory() {

    // let's assume that the stripeConfig constructor was also changed to
    // accept and use the key argument
    return new stripeConfig(API_KEY, BASE_URL, DEFAULTS);
  }];
}
// module.exports = stripeConfigProvider;
export default stripeConfigProvider;
