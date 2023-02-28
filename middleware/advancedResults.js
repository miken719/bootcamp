const advancedResult = (model, populate) => async (req, res, next) => {
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
  query = model.find(JSON.parse(queryStr));
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
  const total = await model.countDocuments(JSON.parse(queryStr));
  query = query.skip(startIndex).limit(limit);
  if (populate) {
    query = query.populate(populate);
  }
  const result = await query.find();
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

  res.advancedResult = {
    success: true,
    count: result.length,
    pagination,
    result: result,
  };
  next();
};
module.exports = advancedResult;
