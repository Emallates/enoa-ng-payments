/**
* stripe.source Module
*
* Deal with stripe sources
* @see [description]
*/
stripeSource.$injector = ['httpService', 'stripeConfig', '$q'];

function stripeSource(httpService, stripeConfig, $q) {
  const extend = angular.extend;
  const forEach = angular.forEach;
  const hopArr = (arr, key) => arr.indexOf(key) > -1;
  return {
    createCard
  }

  function createCard(requestObject) {
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
    return new $q((success, fail) => {
      const create3DSecureCallback = create3DSecure(requestObject, success, fail)
      return httpService.doRequest({
        data: newCard,
        url: '/sources',
        method: 'POST'
      }, create3DSecureCallback)
    })
    // .then(nomi => {
    //   console.log('Nomi', nomi);
    //   return nomi;
    // })
  }

  function create3DSecure(requestObject, success, fail) {
    return (status, cardResponse) => {
      if (status !== 200 || cardResponse.error) {
        return fail(cardResponse.error || cardResponse)
      }
      
      if (cardResponse.card.three_d_secure === 'not_supported' && cardResponse.status === 'chargeable') {
        return success(cardResponse);
      }
      if (cardResponse.card.three_d_secure === 'optional' || cardResponse.card.three_d_secure === 'required') {
        const _3D = extend({}, {
          amount:   stripeConfig.defaults.add_card_amount,
          currency: stripeConfig.defaults.currency
        }, {
          type: 'three_d_secure',
          three_d_secure: { card: cardResponse.id },
          redirect: {
            return_url: ( requestObject.redirect_url || stripeConfig.default_redirect || window.location.href )
          }
        });
        const stripe3dsCallback = makeIFrame(requestObject, success, fail);
        return httpService.doRequest({
          data: _3D,
          url: '/sources',
          method: 'POST'
        }, stripe3dsCallback);
      }
      return fail(cardResponse);
    }

    function authSource(requestObject, success, fail) {
      /* Working ON it*/
      return (status, cardResponse) => {
        const charge = {
          id: cardResponse.id,
          amount: stripeConfig.defaults.add_card_amount
        };
        return httpService.doRequest({
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

    function makeIFrame(requestObject, success, fail) {
      return (status, stripe3dsResponse) => {
        if (status !== 200 || stripe3dsResponse.error) {
          return fail(stripe3dsResponse.error || stripe3dsResponse)
        }
        var tElm = requestObject.targetElement;
        if (!tElm) {
          tElm = angular.element('<div></div>')[0]
          angular.element('body').append(tElm)
        }
        console.log('tElm ->', tElm);
        tElm.innerHTML = `<iframe style="width:100%; height: 800px;" frameborder="0" src="${stripe3dsResponse.redirect.url}"></iframe>`;
        requestObject.nativeElement = tElm;
        const poolingCallback = poolCallback(requestObject, success, fail);
        function watchSource () {
          return httpService.doRequest({
            url: `/sources/${stripe3dsResponse.id}?key=${stripeConfig.key}&client_secret=${stripe3dsResponse.client_secret}`
          })
          .then(R => {
            const source = R.data;
            if (source.status === 'pending') return true;
            return poolingCallback(R.status, source)
          })
          // .delay(1000)
          .then(result => {
            if (result === true) return watchSource();
            return result;
          })
          .catch(fail);

        }
        return watchSource();
      }
      
      function poolCallback(requestObject, success, fail) {
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
            success(source)
          }
        }
      }
    }
  }
}

export default stripeSource;
