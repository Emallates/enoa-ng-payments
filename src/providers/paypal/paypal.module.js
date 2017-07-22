/**
* paypal Module
*
* Paypal service provider
*/

import configsProvider from './configs.provider.js';
import paymentsService from './payments.service.js'

export default angular.module('paypal', [/*'paypal.directives'*/])
  .provider('$paypalconfigs', configsProvider)
  .service('paypalPayments', paymentsService)
  ;
