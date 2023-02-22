const Bootcamp = require("../Schema/bootcampSchema")

// @desc      Get All Bootcamps
// @routes    GET /api/v1/bootcamps
// @access    public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.find()
    return res.status(200).json({ success: true, data: bootcamp })
  } catch (err) {
    return res.status(400).json({ success: false })
  }
}

// @desc      Get Bootcamps by ids
// @routes    GET /api/v1/bootcamps
// @access    public
exports.getBootcampById = async (req, res, next) => {
  try {
    const _id = req.params.id
    const bootcamp = await Bootcamp.findById({ _id })
    if (!bootcamp) {
      res.status(400).json({
        status: false,
      })
    } else {
      res.status(200).json({
        status: true,
        data: bootcamp,
      })
    }
  } catch (err) {
    next(err)
  }
}

// @desc      Post All Bootcamps
// @routes    POST /api/v1/bootcamps
// @access    public
exports.createBootcamp = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
      status: true,
      data: bootcamp,
    })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

// @desc      Update  Bootcamps
// @routes    PUT /api/v1/bootcamps
// @access    public
exports.updateBootcamp = async (req, res, next) => {
  try {
    const id = req.params.id
    const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!bootcamp) {
      res.status(400).json({
        status: false,
      })
    } else {
      res.status(200).json({
        status: true,
        data: bootcamp,
      })
    }
  } catch (err) {
    next(err)
  }
}

// @desc      Delete  Bootcamps
// @routes    DELETE /api/v1/bootcamps
// @access    public
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const id = req.params.id
    const bootcamp = await Bootcamp.findByIdAndDelete(id)
    if (!bootcamp) {
      res.status(400).json({
        status: false,
      })
    } else {
      res.status(200).json({
        status: true,
        data: bootcamp,
      })
    }
  } catch (err) {
    next(err)
  }
}
