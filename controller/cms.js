const asyncHandler = require("../middleware/asyncHandler");
const Cms = require("../Schema/cmsSchema");

exports.homepageCms = asyncHandler(async (req, res, next) => {
  const metaInfo = await Cms.find().select("title description");

  res.status(200).json({
    success: true,
    metaInfo: metaInfo[0],
  });
});

exports.postHomepageCms = asyncHandler(async (req, res, next) => {
  const body = req.body;

  const metaInfo = await Cms.create(body);

  res.status(200).json({
    success: true,
    metaInfo,
  });
});
exports.updateMetaInformation = asyncHandler(async (req, res, next) => {
  const body = req.body;

  const metaInfo = await Cms.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    metaInfo,
  });
});

exports.deleteMeta = asyncHandler(async (req, res, next) => {
  await Cms.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    metaInfo: {},
  });
});
