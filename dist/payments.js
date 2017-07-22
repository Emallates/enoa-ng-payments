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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stripeProvider = __webpack_require__(1);

var _stripeProvider2 = _interopRequireDefault(_stripeProvider);

var _stripeHttpService = __webpack_require__(2);

var _stripeHttpService2 = _interopRequireDefault(_stripeHttpService);

var _stripeSourceService = __webpack_require__(3);

var _stripeSourceService2 = _interopRequireDefault(_stripeSourceService);

var _stripeDirectives = __webpack_require__(4);

var _stripeDirectives2 = _interopRequireDefault(_stripeDirectives);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* stripe Module
*
* Stripe service provider
*/
exports.default = angular.module('stripe', ['stripe.directives']).provider('stripeConfig', _stripeProvider2.default).service('httpService', _stripeHttpService2.default).service('stripeSource', _stripeSourceService2.default);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @todo Improve this code
 */

function stripeConfigProvider() {
  var API_KEY = false;
  var BASE_URL = 'https://api.stripe.com/v1';
  var DEFAULTS = {
    add_card_amount: 100,
    currency: 'usd',
    redirect: null
  };

  this.set = function (configs, defaults) {
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
exports.default = stripeConfigProvider;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var httpService = function () {
  function httpService($http, $httpParamSerializerJQLike, stripeConfig) {
    _classCallCheck(this, httpService);

    this.$http = $http;
    this.stripeConfig = stripeConfig;
    this.$httpParamSerializerJQLike = $httpParamSerializerJQLike;
  }

  _createClass(httpService, [{
    key: 'doRequest',
    value: function doRequest(options, callback) {
      var configs = this.stripeConfig;
      if (options.data) options.data.key = configs.key;

      options.auth = false;
      options.url = options.url.indexOf(configs.base_url) === -1 ? '' + configs.base_url + options.url : options.url;
      options.data = this.$httpParamSerializerJQLike(options.data);
      options.headers = angular.extend({ 'Content-Type': 'application/x-www-form-urlencoded' }, options.headers, { auth: false });
      return typeof callback !== 'function' ? this.$http(options) : this.$http(options).then(function (R) {
        return callback(R.status, R.data);
      }).catch(function (ERR) {
        return callback(ERR.status, ERR.error || ERR.data || ERR);
      });
    }
  }]);

  return httpService;
}();

httpService.$inject = ['$http', '$httpParamSerializerJQLike', 'stripeConfig'];

exports.default = httpService;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* stripe.source Module
*
* Deal with stripe sources
* @see [description]
*/

var extend = angular.extend;
var forEach = angular.forEach;
var hopArr = function hopArr(arr, key) {
  return arr.indexOf(key) > -1;
};

var stripeSource = function () {
  function stripeSource(httpService, stripeConfig, $q) {
    _classCallCheck(this, stripeSource);

    this.$q = $q;
    this.httpService = httpService;
    this.stripeConfig = stripeConfig;
    this.defaults = extend({
      currency: 'usd',
      redirect_url: window.location.href,
      add_card_amount: 100
    }, stripeConfig.defaults);
  }

  _createClass(stripeSource, [{
    key: 'createCard',
    value: function createCard(requestObject) {
      var _this = this;

      var newCard = {
        type: 'card'
      };
      forEach(requestObject.card, function (val, key) {
        if (hopArr[('number', 'cvc', 'exp_month', 'exp_year')], key) {
          newCard['card[' + key + ']'] = val;
        }
      });
      if (requestObject.billing_add) {
        forEach(requestObject.billing_add, function (val, key) {
          if (hopArr(['email', 'name', 'phone'], key)) return newCard['owner[' + key + ']'] = val;else if (key === 'address') {
            forEach(val, function (aVal, aKey) {
              if (hopArr(['postal_code', 'city', 'country', 'line1', 'line2', 'state'], aKey)) {
                return newCard['owner[address][' + aKey + ']'] = aVal;
              }
            });
          } else if (key === 'metadata') {
            forEach(val, function (mVal, mKey) {
              return newCard['metadata[' + key + ']'] = val;
            });
          }
        });
      }

      /* Send Request */
      return new this.$q(function (success, fail) {
        var create3DSecureCallback = _this.create3DSecure(requestObject, success, fail);
        return _this.httpService.doRequest({
          data: newCard,
          url: '/sources',
          method: 'POST'
        }, create3DSecureCallback);
      });
    }
  }, {
    key: 'create3DSecure',
    value: function create3DSecure(requestObject, success, fail) {
      var _this2 = this;

      return function (status, cardResponse) {
        if (status !== 200 || cardResponse.error) {
          return fail(cardResponse.error || cardResponse);
        }

        if (cardResponse.card.three_d_secure === 'not_supported' && cardResponse.status === 'chargeable') {
          return success(cardResponse);
        }
        if (cardResponse.card.three_d_secure === 'optional' || cardResponse.card.three_d_secure === 'required') {
          var _3D = extend({}, {
            amount: _this2.defaults.add_card_amount,
            currency: _this2.defaults.currency
          }, {
            type: 'three_d_secure',
            three_d_secure: { card: cardResponse.id },
            redirect: {
              return_url: requestObject.redirect_url || _this2.defaults.redirect_url
            }
          });
          var stripe3dsCallback = _this2.makeIFrame(requestObject, success, fail);
          return _this2.httpService.doRequest({
            data: _3D,
            url: '/sources',
            method: 'POST'
          }, stripe3dsCallback);
        }
        return fail(cardResponse);
      };
    }
  }, {
    key: 'authSource',
    value: function authSource(requestObject, success, fail) {
      var _this3 = this;

      /* Working ON it*/
      return function (status, cardResponse) {
        var charge = {
          id: cardResponse.id,
          amount: _this3.defaults.add_card_amount
        };
        return _this3.httpService.doRequest({
          data: charge,
          method: 'POST',
          url: '/charges'
        }).then(function (r) {
          return success(r.data);
        }).catch(function (r) {
          return fail(r.error);
        });
      };
      // .then(R => success(R.data))
      // .catch(ERR => fail(ERR.error));
    }
  }, {
    key: 'makeIFrame',
    value: function makeIFrame(requestObject, success, fail) {
      var _this4 = this;

      return function (status, stripe3dsResponse) {
        if (status !== 200 || stripe3dsResponse.error) {
          return fail(stripe3dsResponse.error || stripe3dsResponse);
        }
        var tElm = requestObject.targetElement;
        if (!tElm) {
          tElm = angular.element('<div></div>')[0];
          angular.element('body').append(tElm);
        }
        tElm.innerHTML = '<iframe style="width:100%; height: 300px;" frameborder="0" src="' + stripe3dsResponse.redirect.url + '"></iframe>';
        requestObject.nativeElement = tElm;
        var poolingCallback = _this4.poolCallback(requestObject, success, fail);
        return _this4.watchSource(stripe3dsResponse.id, stripe3dsResponse.client_secret, poolingCallback);
      };
    }
  }, {
    key: 'watchSource',
    value: function watchSource(id, client_secret, onFinish) {
      var _this5 = this;

      return this.httpService.doRequest({
        url: '/sources/' + id + '?key=' + this.stripeConfig.key + '&client_secret=' + client_secret
      }).then(function (R) {
        var source = R.data;
        if (source.status === 'pending') return false;
        return onFinish(R.status, source);
      }).then(function (source) {
        if (source === false) return _this5.watchSource(id, client_secret, onFinish);
        return source;
      }).catch(function (error) {
        return onFinish(400, { error: error });
      });
    }
  }, {
    key: 'poolCallback',
    value: function poolCallback(requestObject, success, fail) {
      return function (status, source) {
        if (status !== 200 || source.error) {
          return fail(source.error);
        } else if (source.status === 'canceled' || source.status === 'consumed' || source.status === 'failed') {
          requestObject.nativeElement.innerHTML = "";
          fail(source.status);
        } else if ( /* source.three_d_secure.authenticated && */source.status === 'chargeable') {
          /* some cards do not need to be authenticated, like the 4242 4242 4242 4242 */
          requestObject.nativeElement.innerHTML = "";
          success(source);
        }
      };
    }

    /* End of class */

  }]);

  return stripeSource;
}();

stripeSource.$inject = ['httpService', 'stripeConfig', '$q'];

exports.default = stripeSource;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _directives = __webpack_require__(5);

exports.default = angular.module('stripe.directives', []).directive('createSourceToStripe', _directives.addCard.Factory);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.addCard = undefined;

var _addCard = __webpack_require__(6);

var _addCard2 = _interopRequireDefault(_addCard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defMap = { addCard: _addCard2.default };

exports.addCard = _addCard2.default;
exports.default = defMap;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var addCard = function () {
  function addCard(stripeSource) {
    _classCallCheck(this, addCard);

    this.restrict = 'EA';
    this.stripeSource = stripeSource;
    this.scope = { source: '=', onSuccess: '&', onFail: '&' };
    this.template = '<div><button ng-click="save()">Save to Stripe</button></div>';
  }

  _createClass(addCard, [{
    key: 'link',
    value: function link($scope, iElm, iAttrs) {
      var _this = this;

      $scope.onFail = $scope.onFail || angular.noop;
      $scope.onSuccess = $scope.onSuccess || angular.noop;
      $scope.source.targetElement = $scope.source.targetElement;
      if (!$scope.source.targetElement) {
        $scope.source.targetElement = angular.element('<div>')[0];
        iElm.append($scope.source.targetElement);
      }
      $scope.save = function () {
        _this.stripeSource.createCard($scope.source).then(function (source) {
          return $scope.onSuccess({ source: source });
        }).catch(function (error) {
          return $scope.onFail({ error: error });
        });
      };
    }
  }], [{
    key: 'Factory',
    value: function Factory(stripeSource) {
      return new addCard(stripeSource);
    }
  }]);

  return addCard;
}();

addCard.Factory.$inject = ['stripeSource'];
exports.default = addCard;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
* paypal Module
*
* Paypal service provider
*/

exports.default = angular.module('paypal', [/*'paypal.directives'*/]);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _stripe = __webpack_require__(0);

var _stripe2 = _interopRequireDefault(_stripe);

var _paypal = __webpack_require__(7);

var _paypal2 = _interopRequireDefault(_paypal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* ng-payments Module
*
* ONe package to deal with multi payment methods for noe stripe only
*/
module.exports = angular.module('ng-payments', ['stripe']);

/***/ })
/******/ ]);
//# sourceMappingURL=payments.js.map