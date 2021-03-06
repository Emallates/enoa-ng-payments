/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ({

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _configsProvider = __webpack_require__(8);

var _configsProvider2 = _interopRequireDefault(_configsProvider);

var _paymentsService = __webpack_require__(9);

var _paymentsService2 = _interopRequireDefault(_paymentsService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* paypal Module
*
* Paypal service provider
*/

exports.default = angular.module('paypal', [/*'paypal.directives'*/]).provider('$paypalconfigs', _configsProvider2.default).service('paypalPayments', _paymentsService2.default);

/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// configs.provider.js
// angular.module('$paypal')
// .provider('$paypalConfigsProvider')

function paypalConfigProvider() {
  var BASE_URL = '/';

  this.set = function (url) {
    BASE_URL = url;
  };

  function paypalConfigs(base_url) {
    this.base_url = base_url;
  }

  this.$get = [function paypalConfigsFactory() {
    return new paypalConfigs(BASE_URL);
  }];
}

exports.default = paypalConfigProvider;

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var payments = function () {
  function payments($http, paypalConfig) {
    _classCallCheck(this, payments);

    this.$http = $http;
    this.configs = paypalConfig;
  }

  _createClass(payments, [{
    key: 'pay',
    value: function pay(amount, currency, description) {
      return this.$http({
        method: 'POST',
        data: { amount: amount, description: description },
        url: this.configs.base_url + '/pay'
      });
    }
  }, {
    key: 'final',
    value: function final(paymentId, token, PayerID) {
      return this.$http({
        method: 'POST',
        data: { paymentId: paymentId, token: token, PayerID: PayerID },
        url: this.configs.base_url + '/pay'
      });
    }
  }]);

  return payments;
}();

payments.$inject = ['$http', '$paypalconfigs'];

exports.default = payments;

/***/ })

/******/ });
//# sourceMappingURL=paypal.js.map