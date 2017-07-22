/**
* stripe.source Module
*
* Deal with stripe sources
* @see [description]
*/

const extend = angular.extend;
const forEach = angular.forEach;
const hopArr = (arr, key) => arr.indexOf(key) > -1;

class stripeSource {
  constructor(httpService, stripeConfig, $q) {
    this.$q = $q;
    this.httpService = httpService;
    this.stripeConfig = stripeConfig;
    this.defaults = extend({
      currency: 'usd',
      redirect_url: window.location.href,
      add_card_amount: 100,
    }, stripeConfig.defaults)
  }
  createCard(requestObject) {
    const newCard = {
      type: 'card'
    };
    forEach(requestObject.card, (val, key) => {
      if (hopArr['number', 'cvc', 'exp_month', 'exp_year'], key) {
        newCard[`card[${key}]`] = val;
      }
    });
    if (requestObject.billing_add) {
      forEach(requestObject.billing_add, (val, key) => {
        if (hopArr(['email', 'name', 'phone'], key)) return newCard[`owner[${key}]`] = val;
        else if (key === 'address') {
          forEach(val, (aVal, aKey) => {
            if (hopArr(['postal_code', 'city', 'country', 'line1', 'line2', 'state'], aKey)) {
              return newCard[`owner[address][${aKey}]`] = aVal;
            }
          })
        }
        else if (key === 'metadata') {
          forEach(val, (mVal, mKey) => (newCard[`metadata[${key}]`] = val))
        }
      });
    }

    /* Send Request */
    return new this.$q((success, fail) => {
      const create3DSecureCallback = this.create3DSecure(requestObject, success, fail)
      return this.httpService.doRequest({
        data: newCard,
        url: '/sources',
        method: 'POST'
      }, create3DSecureCallback)
    })
  }

  create3DSecure(requestObject, success, fail) {
    return (status, cardResponse) => {
      if (status !== 200 || cardResponse.error) {
        return fail(cardResponse.error || cardResponse)
      }
      requestObject.cardResponse = cardResponse;
      if (cardResponse.card.three_d_secure === 'not_supported' && cardResponse.status === 'chargeable') {
        return success(cardResponse);
      }
      if (cardResponse.card.three_d_secure === 'optional' || cardResponse.card.three_d_secure === 'required') {
        const _3D = extend({}, {
          amount:   this.defaults.add_card_amount,
          currency: this.defaults.currency
        }, {
          type: 'three_d_secure',
          three_d_secure: { card: cardResponse.id },
          redirect: {
            return_url: ( requestObject.redirect_url || this.defaults.redirect_url )
          }
        });
        const stripe3dsCallback = this.makeIFrame(requestObject, success, fail);
        return this.httpService.doRequest({
          data: _3D,
          url: '/sources',
          method: 'POST'
        }, stripe3dsCallback);
      }
      return fail(cardResponse);
    }
  }

  authSource(requestObject, success, fail) {
    /* Working ON it*/
    return (status, cardResponse) => {
      const charge = {
        id: cardResponse.id,
        amount: this.defaults.add_card_amount
      };
      return this.httpService.doRequest({
        data: charge,
        method: 'POST',
        url: '/charges'
      })
      .then(r => success(r.data))
      .catch(r => fail(r.error))
    }
    // .then(R => success(R.data))
    // .catch(ERR => fail(ERR.error));
  }

  makeIFrame(requestObject, success, fail) {
    return (status, stripe3dsResponse) => {
      if (status !== 200 || stripe3dsResponse.error) {
        return fail(stripe3dsResponse.error || stripe3dsResponse)
      }
      var tElm = requestObject.targetElement;
      if (!tElm) {
        tElm = angular.element('<iframe>')[0]
        angular.element('body').append(tElm)
      }
      tElm.src = stripe3dsResponse.redirect.url;
      requestObject.nativeElement = tElm;
      const poolingCallback = this.poolCallback(requestObject, success, fail);
      return this.watchSource(stripe3dsResponse.id, stripe3dsResponse.client_secret, poolingCallback);
    }
  }

  watchSource (id, client_secret, onFinish) {
    return this.httpService.doRequest({
      url: `/sources/${id}?key=${this.stripeConfig.key}&client_secret=${client_secret}`
    })
    .then(R => {
      const source = R.data;
      if (source.status === 'pending') return false;
      return onFinish(R.status, source)
    })
    .then(source => {
      if (source === false) return this.watchSource(id, client_secret, onFinish);
      return source;
    })
    .catch(error => onFinish(400, { error }));
  }

  poolCallback(requestObject, success, fail) {
    return (status, source) => {
      if (status !== 200 || source.error) {
        return fail(source.error)
      }
      else if (source.status === 'canceled' || source.status === 'consumed' || source.status === 'failed') {
        requestObject.nativeElement.innerHTML = "";
        fail(source.status);
      }
      else if (/* source.three_d_secure.authenticated && */ source.status === 'chargeable') {
        /* some cards do not need to be authenticated, like the 4242 4242 4242 4242 */
        requestObject.nativeElement.innerHTML = "";
        success( extend(requestObject.cardResponse, source))
      }
    }
  }

  /* End of class */
}

stripeSource.$inject = ['httpService', 'stripeConfig', '$q'];

export default stripeSource;
