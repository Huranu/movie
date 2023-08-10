const MyError = require("../utils/myError");
const paginate = require("../utils/paginate-sequelize");

// const asyncHandler = require("../middleware/asyncHandler");
const asyncHandler = require("express-async-handler");

exports.createComment = asyncHandler(async (req, res, next) => {
  const comment = await req.db.comment.create(req.body);

  res.status(200).json({
    success: true,
    data: comment,
  });
});

exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await req.db.comment.findByPk(req.params.id);

  if (!comment) {
    throw new MyError("Iim id-tai comment oldsongui", 400);
  }

  comment = await comment.update(req.body);

  res.status(200).json({
    success: true,
    data: comment,
  });
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await req.db.comment.findByPk(req.params.id);

  if (!comment) {
    throw new MyError("Iim id-tai comment oldsongui", 400);
  }

  await comment.destroy();

  res.status(200).json({
    success: true,
    data: comment,
  });
});

exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = await req.db.comment.findByPk(req.params.id);

  if (!comment) {
    throw new MyError("Iim id-tai comment oldsongui", 400);
  }

  const [result] = await req.db.sequelize.query(
    "SELECT u.name.c.comment FROM 'user' u left join comment c on u.id=c.userId where c.comment like '%nice%'",
    {
      model: req.db.comment,
    }
  );

  res.status(200).json({
    success: true,
    result,
    user: await comment.getUser(),
    book: await comment.getBook(),
    data: comment,
  });
});

exports.getComments = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  // Pagination
  const pagination = await paginate(page, limit, req.db.comment);

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

  const comments = await req.db.comment.findAll(Query);

  res.status(200).json({
    success: true,
    data: comments,
    pagination,
  });
});
