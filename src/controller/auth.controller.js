const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync')
const sendEmail = require('../utils/email');
const AppError = require('../utils/AppError.js');
const crypto = require('crypto')
// HELPER FUNCTIONS
const getToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_IN,
    });
  };

const generateTokenAndSendResponse = function(res , user){
    const token = getToken(user._id);
    user.password = undefined
    user.confirmPassword = undefined
    return res.status(200).json({
      status: 'success',
      jwt: token,
      data: {
        user: user,
      },
    });
}

//   MIDDLEWARES

// protect middleware

const protect = catchAsync(async (req, res, next) => {
    // get token from headers
    let jwtToken = req.headers.authorization?.split(' ')[1];
    // check token
    if (!jwtToken) return next(new AppError('jwt token not defined', 401));
    // verify token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    // user still exist
    const user = await userModel.findOne({ _id: decoded.id });
    if (!user) return next(new AppError('User no longer exist', 404));
    // user password change
    const changeDate = Date.parse(user?.changedAt) / 1000;
    const jwtStartDate = decoded.iat;
    if (changeDate > jwtStartDate)
      return next(
        new AppError('jwt no longer valid because of user updated', 401)
      );
  
    // pass the user to the next middleware
    req.user = user;
    next();
  });
  
  const checkPermission = (...roles) => {
    return (req, res, next) => {
      let currentRole = req.user.role;
      if (!roles.includes(currentRole))
        return next(
          new AppError('This user is not allowed for this action', 403)
        );
      next();
    };
  };


  
//  ROUTE CONTROLLERS
  
const signup = catchAsync(async function (req, res, next) {
    const { name, email, password, confirmPassword, role, photo } = req.body;
    const returnUser = await userModel.create({
      name,
      email,
      password,
      confirmPassword,
      role,
      photo,
    });
  
    generateTokenAndSendResponse(res , returnUser)
  });


  const signin = catchAsync(async function (req, res, next) {
    const { email, password } = req.body;
    // find user on database
    const user = await userModel.findOne({ email }).select('+password');
    // check password equal
    const isPasswordEqual = await bcrypt.compare(password, user.password);
    if (!user || !isPasswordEqual)
      return next(new AppError('Invalid email or password', 401));
  
    generateTokenAndSendResponse(res,user)
  });
  

  const forgotPassword = catchAsync(async function (req, res, next) {
    // 1 ) get the email provide and check user exist
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return next(new AppError("User doesn't exist", 404));
    // 2 ) if exist , generate token for password reset
  
    const { resetToken, resetPasswordToken, resetTokenExpire } =
      user.passwordResetToken();
    await userModel.updateOne(
      { email },
      {
        resetPasswordToken,
        resetTokenExpire,
      }
    );
  
    //  3 ) send email for reset0
    const reqUrl = `${req.protocol}://${req.get(
      'host'
    )}/resetpassword/${resetToken}`;
    console.log(resetToken);
    const message = `This is the password reset link for you . ${reqUrl}  (this will expire in 10 min)`;
    let option = {
      email: user.email,
      subject: `Password Reset Link - ${reqUrl}`,
      text: message,
    };
    try {
      await sendEmail(option);
      return res.status(200).json({
        status: 'success',
        message: 'Reset link sent to your email . ',
      });
    } catch (err) {
      resetPasswordToken = undefined;
      resetTokenExpire = undefined;
      await userModel.updateOne(
        { email },
        {
          resetPasswordToken,
          resetTokenExpire,
        }
      );
      return res.status(200).json({
        status: 'fail',
        message: 'Error occured while sending email .  ',
      });
    }
  });
  

  const resetPassword = catchAsync(async function (req, res, next) {
    // get token
    const { token } = req.params;
  
    // hash token
    const reqToken = crypto.createHash('sha256').update(token).digest('hex');
  
    // find user in database
    const user = await userModel.findOne({
      resetPasswordToken: reqToken,
      resetTokenExpire: { $gt: Date.now() },
    });
  
    if (!user) return next(new AppError('Invalid token or has expired', 403));
  
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.resetPasswordToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    generateTokenAndSendResponse(res, user)
  });
  


  const updatePasswrod = catchAsync(async function (req, res, next) {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
  
    let jwtToken = req.headers.authorization?.split(' ')[1];
    // console.log(jwtToken);
    // check token
    if (!jwtToken) return next(new AppError('jwt token not defined', 401));
    // verify token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    // user still exist
    const user = await userModel.findOne({ _id: decoded.id }).select('+password');
    if (!user) return next(new AppError('User no longer exist', 404));
    const isPasswordEqual = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordEqual)
      return next(new AppError('Incorrect current password', 400));
  
    if (newPassword !== confirmNewPassword)
      return next(
        new AppError('new password and confirm password are not the same', 404)
      );
    user.password = newPassword;
    user.confirmPassword = confirmNewPassword;
    await user.save();
  
    return res.status(200).json({
      status: 'success',
    });
  });



  const deleteAcc = catchAsync(async function (req, res, next) {
    let jwtToken = req.headers.authorization?.split(' ')[1];
    if (!jwtToken) return next(new AppError('jwt token not defined', 401));
    // verify token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    if (!decoded.id) return next(new AppError('Invalid Id', 401));
  
    const userId = decoded.id;
    await userModel.findByIdAndUpdate(userId, { active: false });
  
    return res.status(200).json({
      status: 'success',
    });
  });
  

  module.exports = {
    signup,
    signin,
    forgotPassword,
    resetPassword,
    protect,
    checkPermission,
    updatePasswrod,
    deleteAcc
  }  