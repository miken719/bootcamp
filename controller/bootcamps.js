const path = require("path");
const Bootcamp = require("../Schema/bootcampSchema");
const asyncHandler = require("../middleware/asyncHandler");
const geocoder = require("../middleware/geoCoder");
const ErrorResponse = require("../middleware/error");
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// @desc      Get All Bootcamps
// @routes    GET /api/v1/bootcamps
// @access    public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResult);
});
exports.getBootcampsCourses = async (req, res) => {
  const bootcamp = await Bootcamp.find();
  res.status(200).json({ data: bootcamp });
};
// @desc      Get Bootcamps by ids
// @routes    GET /api/v1/bootcamps
// @access    public
exports.getBootcampById = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    res.status(400).json({
      status: false,
    });
  } else {
    res.status(200).json({
      status: true,
      data: bootcamp,
    });
  }
});

// @desc      Post All Bootcamps
// @routes    POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
  //if user not an admin, they only publish one bootcamp
  if (req.user.role !== "admin" && publishedBootcamp) {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    status: true,
    data: bootcamp,
  });
});

// @desc      Update  Bootcamps
// @routes    PUT /api/v1/bootcamps
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let bootcamp = await Bootcamp.findById(id);

  // Only authorize use can be update bootcamp
  if (req.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`This ID ${id} not authorize for update bootcamp`),
      400
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    res.status(400).json({
      status: false,
    });
  } else {
    res.status(200).json({
      status: true,
      data: bootcamp,
    });
  }
});

// @desc      Delete  Bootcamps
// @routes    DELETE /api/v1/bootcamps
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let bootcamp = await Bootcamp.findById(id);
  if (req.user.toString !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`This ID ${id} is not authorize for delete bootcamp`)
    );
  }
  if (!bootcamp) {
    next(new ErrorResponse(`Something went wrong`, 404));
  } else {
    bootcamp.remove();
    res.status(200).json({
      status: true,
      message: "Bootcamp Delete Successfully",
    });
  }
});

// @desc      Get  Bootcamps in Radius
// @routes    GET /api/v1/bootcamps
// @access    public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  let loc = await geocoder.geocode(zipcode);
  let lng = loc[0].longitude;
  let lat = loc[0].latitude;

  // Calc Location by radius
  // Radius of Earth   3,963 Miles   6,378 KM
  let radiusOfEarth = 3963;
  let radius = distance / radiusOfEarth;
  const bootcamp = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: true,
    count: bootcamp.length,
    data: bootcamp,
  });
});

// @desc      Upload  Photos
// @routes    PUT /api/v1/bootcamps
// @access    Private
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse("Something went wrong...", 404));
  }
  if (!req?.files) {
    return next(new ErrorResponse("Please Upload File", 404));
  }

  let file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please Upload an Image File Only", 404));
  }
  if (file.size > process.env.MAX_UPLOAD_FILE) {
    return next(
      new ErrorResponse(
        `Please upload an file size less than ${process.env.MAX_UPLOAD_FILE}`,
        404
      )
    );
  }

  cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
    if (err) {
      console.log("FILE_UPLOAD: ", err);
    } else {
      file.name = `${result.public_id}${path.parse(file.name).ext}`;
      await Bootcamp.findByIdAndUpdate(req.params.id, {
        photo: `${file.name}`,
      });
      res.status(200).json({ status: true, file: file.name });
    }
  });
});
