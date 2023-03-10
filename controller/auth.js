const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../middleware/error");
const sendEmail = require("../middleware/sendEmail");
const User = require("../Schema/registerSchema");
const crypto = require("crypto");
const emailTemplate = require("../template/email");
// @desc      Register New User
// @routes    POST /api/v1/auth
// @access    Private
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  const user = await User.create({ username, email, password, role });
  sendTokentoCookie(user, 200, res);
});

// @desc      Login User
// @routes    POST /api/v1/auth
// @access    Private
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Email and Password Verify
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an Email and Password", 404));
  }

  // User Verify
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 404));
  }
  // Password Compare and match from database
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 404));
  }
  sendTokentoCookie(user, 200, res);
});

const sendTokentoCookie = (user, statusCode, res) => {
  const token = user.getJwtWebToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", options, { httpOnly: true })
    .json({ success: true, token });
};
// @desc      Get Current user
// @routes    GET /api/v1/getMe
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
  next();
});
// @desc      Get All Users
// @routes    GET /api/v1/auth
// @access    Private
exports.getUsers = asyncHandler(async (req, res, next) => {
  const user = await User.find({});
  res.status(200).json({ success: true, user });
});

// @desc      Get All Users
// @routes    GET /api/v1/auth
// @access    Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete({ _id: id });
  if (!user) {
    return next(new ErrorResponse("User Not Found", 404));
  }
  res.status(200).json({ success: true, message: `User is deleted` });
});
// @desc      ForgetPassowrd Token
// @routes    GET /api/v1/forgetpassword
// @access    Private
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ErrorResponse(`User not found on this email :${req.body.email}`, 404)
    );
  }
  const resetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `Hello, ${user.username} you requested for reset password for your account here's Link to reset password ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message,
      html: emailTemplate(resetUrl),
    });
    res.status(200).json({ success: true, message: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not sent", 500));
  }
});

// @desc     Reset Password
// @routes    PUT /api/v1/auth
// @access    Private
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokentoCookie(user, 200, res);
});
