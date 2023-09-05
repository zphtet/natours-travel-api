const stripe = require('stripe')(
  'sk_test_51NmchlD6x3glzp8SusiQW6aUMeenIAamIt08JBv3n9KSixZZnSnfW4hYlgGXyxVJ6nCHU3cNWVXF23Dti6iVGZmH00Ms2uK6po'
);

const catchAsync = require('../utils/catchAsync');
const TourModel = require('../model/tourModel');

// MIDDLEWARE

exports.getTourAndPass = catchAsync(async (req, res, next) => {
  const { tourid } = req.body;
  console.log('tourid', tourid);
  const data = await TourModel.findById(tourid);
  //   console.log(data);
  //   return res.status(200).json({
  //     status: 'success',
  //     tour: data,
  //   });
  req.tour = data;
  next();
});

const YOUR_DOMAIN = 'http://localhost:8000';

exports.bookTour = async (req, res) => {
  // get user

  // get tour
  const { name, price } = req.tour;
  //   console.log(name, price);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: name,
            // images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: price * 100,
        },
        // adjustable_quantity: {
        //   enabled: true,
        //   minimum: 1,
        //   maximum: 10,
        // },
        quantity: 1,
      },
    ],
    mode: 'payment',
    // allow_promotion_codes: true,
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });
  //   console.log(session);

  //   res.redirect(303, session.url);
  return res.status(200).json({
    status: 'success',
    url: session.url,
  });
};
