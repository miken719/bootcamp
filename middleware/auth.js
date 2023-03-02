const jwt = require("jsonwebtoken");
const User = require("../Schema/registerSchema");
const ErrorResponse = require("./error");
const asyncHandler = require("./asyncHandler");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not Authorized to access this route", 401));
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decode.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not Authorized to access this route", 401));
  }
});

exports.manageRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `${req.user.role} this role is not Authorized to access route`,
          403
        )
      );
    }
    next();
  };
};
