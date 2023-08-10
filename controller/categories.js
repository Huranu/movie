const Category = require("../models/Category");
const MyError = require("../utils/myError");
const paginate = require("../utils/paginate");
// const asyncHandler = require("../middleware/asyncHandler");
const asyncHandler = require("express-async-handler");

exports.getCategories = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  // Pagination
  const pagination = await paginate(page, limit, Category);

  const categories = await Category.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: categories,
    pagination,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  req.db.teacher.create({
    id: 1,
    name: "hhhhhh",
    phone: "90909090",
  });
  const category = await Category.findById(req.params.id).populate("books");
  if (!category) {
    throw new MyError("Iim id-tai category baihgui", 400);
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    throw new MyError("Iim id-tai category baihgui", 400);
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new MyError("Iim id-tai category baihgui", 400);
  }

  category.remove();

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  console.log("---------" + req.body);

  const category = await Category.create(req.body);

  res.status(200).json({
    success: true,
    data: category,
  });
});
