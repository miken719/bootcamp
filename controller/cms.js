const asyncHandler = require("../middleware/asyncHandler");
const Cms = require("../Schema/cmsSchema");

exports.homepageCms = asyncHandler(async (req, res, next) => {
  const metaInfo = await Cms.find().select("title description");

  res.status(200).json({
    success: true,
    metaInfo: metaInfo,
  });
});

exports.postHomepageCms = asyncHandler(async (req, res, next) => {
  const body = req.body;

  const metaInfo = Cms.create(body);
  // console.log(metaInfo);

  res.status(200).json({
    success: true,
    metaInfo: body,
  });
});
