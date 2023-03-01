const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../middleware/error");
const User = require("../Schema/registerSchema");
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;
  const user = await User.create({ username, email, password, role });

  res
    .status(200)
    .json({ success: true, message: "User registered successfully" });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Email and Password Verify
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an Email and Password", 404));
  }

  // User Verify
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  // Password Compare and match from database
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const token = user.getJwtWebToken();
  res.status(200).json({ success: true, token, message: "Login Successfully" });
});
