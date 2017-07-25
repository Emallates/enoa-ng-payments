const _ = require('lodash')
  , Promise = require('bluebird')
  , Paypal = require('paypal-rest-sdk')
  , { paypal } = require('../configs')
  , { redirect_url, cancel_url } = paypal
  // , { mode, client_id, client_secret } = paypal
  ;
// Paypal.configure({
//   'mode': 'sandbox', //sandbox or live
//   'client_id': 'AYqNeJRZ7K04byKNk2nyWdNXYpotyI-2ebs7A_pyPW4xzOjCRaa--Ez29iMwpRZu5iFPjmj9UZLjs6_o',
//   'client_secret': 'EJf4J8-83Fs6Thv5eXkMKjq7xVAxU6mYBX2-5fU7wB4PXTTOD3DNnYFupYxDbV2bbMoLF8ZxROt-hWOu'
// })
Paypal.configure({ mode, client_id, client_secret } = paypal)



const Payment = {
  intent: "sale",
  payer: { "payment_method": "paypal" },
  redirect_urls: {
    cancel_url: `${cancel_url}/fail`,
    return_url: `${redirect_url}/success`
  },
  transactions: [{
    amount: {
      total: "100",
      currency: 'USD',
    },
    description: 'PAyment details ',
  }]
}

const nTrans = {
  "payer_id": "J87SQ4NZAKKQ6",
  "transactions": Payment.transactions
}
Paypal.payment.create(Payment, function (err, trans) {
  if (err) throw err;
  console.log(trans)
  Paypal.payment.execute(trans.id || 'PAY-8RP13984FG9804533LF26E3A', nTrans, function (err, trans2) {
    console.log(err || trans2);
  });
})


module.exports = {
  Paypal,
  pay(payment, callback) {
    const newPayment = _.assignIn({}, Payment)
    newPayment.transactions = [{
      amount: {
        total: payment.amount,
        currency: payment.currency,
      },
      description: payment.description,
    }];
    // return callback(null, newPayment);
    // Paypal.payment.create(newPayment, callback)
    Paypal.payment.create(newPayment, callback);
  },
  finish(paymentId, token, PayerID) {
    return Promise.fromCallback(onDone => Paypal.payment.execute(paymentId, PayerId, onDone))
    .then(R => {
      return res.json(R);
    })
    .catch(Err => console.log(Err))
  }
};
