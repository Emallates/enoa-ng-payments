const fs = require('fs')
  , path = require('path')
  , express = require('express')
  , morgan = require('morgan')
  , parser = require('body-parser')
  , paypal = require('paypal-rest-sdk')

  , app = express()
  , port = 3000
  , accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs.log'), {flags: 'a'})
  // , accessFailStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
  ;

const payments = {}
var paypalRouter = express.Router()

paypalRouter.use(morgan('combined', {stream: accessLogStream}))

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AYqNeJRZ7K04byKNk2nyWdNXYpotyI-2ebs7A_pyPW4xzOjCRaa--Ez29iMwpRZu5iFPjmj9UZLjs6_o',
  'client_secret': 'EJf4J8-83Fs6Thv5eXkMKjq7xVAxU6mYBX2-5fU7wB4PXTTOD3DNnYFupYxDbV2bbMoLF8ZxROt-hWOu'
});

app.use(parser.json());
app.use(parser.urlencoded({ extended: true/*, parameterLimit: 10000, limit: 1024 * 1024 * 10*/ }));
app.use(express.static(__dirname + '/public'));
app.use('/dist',  express.static(path.resolve(__dirname, '../dist')));
app.use('/bower_components',  express.static(path.resolve(__dirname, '../bower_components')));


app.get('/cardtest', function (req, res, next) {
  res.redirect('/card.html')
})


var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        /*"return_url": "https://7b8677ee.ngrok.io/paypal/payment/success",
        "cancel_url": "https://7b8677ee.ngrok.io/paypal/payment/fail"*/
        "return_url": "https://7b8677ee.ngrok.io/card.html",
        "cancel_url": "https://7b8677ee.ngrok.io/card.html"
    },
    "transactions": [{
        // "item_list": {
        //     "items": [{
        //         "name": "item",
        //         "sku": "item",
        //         "price": "1.00",
        //         "currency": "USD",
        //         "quantity": 1
        //     }]
        // },
        "amount": {
            "currency": "USD",
            "total": "1.00"
        },
        "description": "<Test payment payment description.>"
    }]
};

app.get('/all', function (req, res, next) {
  return res.json({ query: req.query, params: req.params });
})


app.post('/pay', (req, res, next) => {
  create_payment_json.transactions[0].amount.total = req.body.amount;
  paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        console.log(error)
        throw error;
      } else {
        payments[payment.id] = payment;
        const link = payment.links.filter(lItr => (lItr.method === 'REDIRECT'))[0].href;
        console.log(link);
        res.json({link})
      }
  });
})

paypalRouter.route('/payment/success')
.get(function (req, res, next) {
  var paymentId = req.query.paymentId;
  var payerId = { payer_id: req.query.PayerID };

  paypal.payment.execute(paymentId, payerId, function(error, payment){
    if(error){
      console.error(JSON.stringify(error));
    } else {
      res.json(payment)
      // if (payment.state == 'approved'){
      //   console.log('payment completed successfully');
      // } else {
      //   console.log('payment not successful');
      // }
    }
  });
})
paypalRouter.route('/payment/fail')
.get(function (req, res, next) {

})

paypalRouter.route('/notify')
app.use('/paypal', paypalRouter)


app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))