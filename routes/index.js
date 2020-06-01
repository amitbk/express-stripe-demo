var express = require('express');
var router = express.Router();
const stripe = require('stripe')('sk_test_1WBNGED0mMIxcLNglq4CnsB200CyR7o8ug'); // Add your Secret Key Here

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { viewTitle: 'Express Stripe' });
});

router.get('/completed', function(req, res, next) {
    res.render('completed', { viewTitle: 'Thank you' });
});


router.post("/charge", (req, res) => {
    try {
      stripe.customers
        .create({
          name: req.body.name,
          email: req.body.email,
          source: req.body.stripeToken
        })
        .then(customer =>
          stripe.charges.create({
            amount: req.body.amount * 100,
            currency: "usd",
            customer: customer.id
          })
        )
        .then(() => res.render("completed"))
        .catch(err => console.log(err));
    } catch (err) {
      res.send(err);
    }
  });


  router.get('/secret', async (req, res) => {
    let amount = !!req.body.amount ? req.body.amount : 1000;
    
    // create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.query.amount,
        currency: 'usd',
        metadata: {integration_check: 'test'},
        description: req.query.desc,
        // name: 'Amit',
        // address: 'Pune'

        shipping: {
            name: 'Jenny Rosen',
            address: {
              line1: '510 Townsend St',
              postal_code: '98140',
              city: 'San Francisco',
              state: 'CA',
              country: 'US',
            },
          },
        
      });
  
    res.json({client_secret: paymentIntent.client_secret});
  });


module.exports = router;
