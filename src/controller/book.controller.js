const stripe = require('stripe')(
  'sk_test_51NmchlD6x3glzp8SusiQW6aUMeenIAamIt08JBv3n9KSixZZnSnfW4hYlgGXyxVJ6nCHU3cNWVXF23Dti6iVGZmH00Ms2uK6po'
);

const catchAsync = require('../utils/catchAsync');
const TourModel = require('../model/tourModel');

// MIDDLEWARE

exports.getTourAndPass = catchAsync(async (req, res, next) => {
  const { tourid } = req.body;
  const data = await TourModel.findById(tourid);
  req.tour = data;
  next();
});

const YOUR_DOMAIN = 'http://localhost:8000';

exports.bookTour = async (req, res) => {
  // get tour
  const { name, price, imageCover } = req.tour;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: name,
            images: [`https://www.natours.dev/img/tours/${imageCover}`],
          },
          unit_amount: price * 100,
        },

        quantity: 1,
      },
    ],
    mode: 'payment',
    // customer: customer.id,
    customer_email: req.user.email,
    // allow_promotion_codes: true,
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });
  // here we will put db insert code

  return res.status(200).json({
    status: 'success',
    url: session.url,
  });
};
