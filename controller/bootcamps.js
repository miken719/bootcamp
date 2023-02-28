const path = require("path");
const Bootcamp = require("../Schema/bootcampSchema");
const asyncHandler = require("../middleware/asyncHandler");
const geocoder = require("../middleware/geoCoder");
const ErrorResponse = require("../middleware/error");

// @desc      Get All Bootcamps
// @routes    GET /api/v1/bootcamps
// @access    public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  //Copy query
  let reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);
  let queryStr = JSON.stringify(reqQuery);
  // create operators
  const regex = /\b(gt|gte|lt|lte|in)\b/g;
  queryStr.replace(regex, (match) => `$${match}`);
  // Find bootcamps
  query = Bootcamp.find(JSON.parse(queryStr)).populate({
    path: "courses",
    select: "title description",
  });
  // Fetch select query request
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");

    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //paginations
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments(JSON.parse(queryStr));
  query = query.skip(startIndex).limit(limit);

  const bootcamp = await query.find();
  let pagination = {};

  if (endIndex <= total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  return res.status(200).json({
    success: true,
    count: bootcamp.length,
    pagination,
    data: bootcamp,
  });
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
// @access    public
exports.createBootcamp = asyncHandler(async (req, res) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    status: true,
    data: bootcamp,
  });
});

// @desc      Update  Bootcamps
// @routes    PUT /api/v1/bootcamps
// @access    public
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
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
// @access    public
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bootcamp = await Bootcamp.findById(id);
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
// @access    public
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
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.UPLOAD_FILE_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      new ErrorResponse(`Something went wrong...`, 500);
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({ status: true, file: file.name });
  });
});
