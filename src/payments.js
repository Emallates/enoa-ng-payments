/**
* ng-payments Module
*
* ONe package to deal with multi payment methods for noe stripe only
*/
import stripe from "./providers/stripe/stripe.module"
module.exports = angular.module('ng-payments', ['stripe']);