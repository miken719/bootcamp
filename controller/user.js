const User = require("../Schema/registerSchema");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../middleware/error");

// @desc      Get All user
// @routes    GET /api/v1/users
// @access    Private
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, users: res.advancedResult });
});

// @desc      Get user
// @routes    GET /api/v1/users:id
// @access    Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc      Post user
// @routes    POST /api/v1/users
// @access    Private
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).json({
    success: true,
    user,
  });
});

// @desc      Update user
// @routes    UPDATE /api/v1/users:id
// @access    Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc      Delete user
// @routes    DELETE /api/v1/users:id
// @access    Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
