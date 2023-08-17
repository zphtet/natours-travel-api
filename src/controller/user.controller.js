const userModel = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');

const signup = catchAsync(async function (req, res, next) {
  const user = req.body;
  const returnUser = await userModel.create(user);

  return res.status(200).json({
    status: 'success',
    data: {
      user: returnUser,
    },
  });
});

module.exports = {
  signup,
};
