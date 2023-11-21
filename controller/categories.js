const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

exports.getCategories = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  // Pagination
  const pagination = await paginate(page, limit, req.db.category);

  let Query = { offset: pagination.start - 1, limit };

  if (req.query) {
    Query.where = req.query;
  }
  if (select) {
    Query.attributes = select;
  }
  if (sort) {
    Query.order = sort
      .split(" ")
      .map((el) => [
        el.charAt(0) === "-" ? el.substring(1) : el,
        el.charAt(0) === "-" ? "DESC" : "ASC",
      ]);
  }
  const categories = await req.db.category.findAll(Query);

  res.status(200).json({
    success: true,
    data: categories,
    pagination,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await req.db.category.findByPk(req.params.id);
  if (!category) {
    throw new MyError("Iim id-tai category baihgui", 400);
  }

  const genres = await req.db.genre.findAll({
    where: { categoryId: category.id },
  });

  res.status(200).json({
    success: true,
    data: {
      category: category,
      genres: genres,
    },
  });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await req.db.category.findByPk(req.params.id);
  if (!category) {
    throw new MyError("Iim id-tai category baihgui", 400);
  }
  category = await category.update(req.body);
  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await req.db.category.findByPk(req.params.id);
  if (!category) {
    throw new MyError("Iim id-tai category baihgui", 400);
  }

  category.destroy();

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await req.db.category.create(req.body);
  console.log("--------------" + req.db);
  await category.save();
  res.status(200).json({
    success: true,
    data: category,
  });
});
