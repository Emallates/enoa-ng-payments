const fs = require('fs')
  , path = require('path')
  , morgan = require('morgan')
  , express = require('express')
  , Promise = require('bluebird')
  , parser = require('body-parser')
  , Paypal = require('./services/paypal')

  , app = express()
  , port = 3000
  , accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs.log'), {flags: 'a'})
  // , accessFailStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
  ;


app.use((req, res, next) => {
  req.user = {
    account: {
      currency: 'USD'
    }
  };
  next();
});
app.use(parser.json());
app.use(parser.urlencoded({ extended: true/*, parameterLimit: 10000, limit: 1024 * 1024 * 10*/ }));
app.use(express.static(__dirname + '/public'));
app.use('/dist',  express.static(path.resolve(__dirname, '../dist')));
app.use('/bower_components',  express.static(path.resolve(__dirname, '../bower_components')));

var paypalRouter = express.Router()
paypalRouter.use(morgan('combined', {stream: accessLogStream}))

paypalRouter.post('/pay', (req, res, next) => {
  Promise.fromCallback(cb => Paypal.pay({
    amount: req.body.amount.toString().indexOf('.') > -1 ? req.body.amount : `${req.body.amount}.00`,
    currency: req.user.account.currency,
    description: req.body.description
  }, cb))
    .then(R => {
      return res.json({ link: R.links.filter(lItr => lItr.rel === 'approval_url')[0].href })
    })
    .catch(next);
  // create_payment_json.transactions[0].amount.total = req.body.amount;
  // paypal.payment.create(create_payment_json, function (error, payment) {
  //     if (error) {
  //       console.log(error)
  //       throw error;
  //     } else {
  //       payments[payment.id] = payment;
  //       const link = payment.links.filter(lItr => (lItr.method === 'REDIRECT'))[0].href;
  //       console.log(link);
  //       res.json({link})
  //     }
  // });
})

paypalRouter.route('/:status')
  .get((req, res, next) => {
    res.json({query: req.query, params: req.params})
  })
app.use('/paypal', paypalRouter)

app.use((err, req, res, next) => res.status(err.httpStatusCode).json(err));


app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))