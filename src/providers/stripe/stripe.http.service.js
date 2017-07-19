
class httpService {
  constructor($http, $httpParamSerializerJQLike, stripeConfig) {
    this.$http = $http;
    this.stripeConfig = stripeConfig;
    this.$httpParamSerializerJQLike = $httpParamSerializerJQLike;
  }
  doRequest(options, callback) {
    const configs = this.stripeConfig;
    if (options.data) options.data.key = configs.key;

    options.url = (options.url.indexOf(configs.base_url) === -1)
      ? `${configs.base_url}${options.url}`
      : options.url;
    options.data = this.$httpParamSerializerJQLike(options.data);
    options.headers = angular.extend({ 'Content-Type': 'application/x-www-form-urlencoded' }, options.headers);
    return (typeof callback !== 'function')
    ? this.$http(options)
    : this.$http(options)
        .then(R => callback(R.status, R.data))
        .catch(ERR => callback(ERR.status, (ERR.error || ERR.data || ERR)))
  }
}

httpService.$injector = ['$http', '$httpParamSerializerJQLike', 'stripeConfig'];

export { httpService as default }
