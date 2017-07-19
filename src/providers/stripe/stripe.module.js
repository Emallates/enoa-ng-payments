/**
* stripe Module
*
* Stripe service provider
*/
import stripeProvider from "./stripe.provider.js";
import stripeHttpService from "./stripe.http.service.js";
import stripeSourceService from "./stripe.source.service.js";
import stripeDirectives from "./stripe.directives.js";

export default angular.module('stripe', ['stripe.directives'])
  .provider('stripeConfig', stripeProvider)
  .service('httpService', stripeHttpService)
  .service('stripeSource', stripeSourceService)
  // ;