const Genre = require("../models/sequelize/Genre");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");
const paginate = require("../utils/paginate");

exports.getGenres = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  // Pagination
  const pagination = await paginate(page, limit, req.db.genre);

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
  const genres = await req.db.genre.findAll(Query);

  res.status(200).json({
    success: true,
    data: genres,
    pagination,
  });
});

exports.createGenre = asyncHandler(async (req, res, next) => {
  const genre = await req.db.genre.create(req.body);

  await genre.save();

  res.status(200).json({
    success: true,
    data: genre,
  });
});
exports.deleteGenre = asyncHandler(async (req, res, next) => {
  const genre = await req.db.genre.findByPk(req.params.id);
  if (!genre) {
    throw new MyError("Iim id-tai genre baihgui baina", 400);
  }

  genre.destroy();

  res.status(200).json({
    success: true,
    data: genre,
  });
});
exports.getGenre = asyncHandler(async (req, res, next) => {
  const genre = await req.db.genre.findByPk(req.params.id);
  if (!genre) {
    throw new MyError("Iim id-tai genre baihgui baina", 400);
  }

  const movies = await req.db.movie.findAll({ where: { genreId: genre.id } });

  res.status(200).json({
    success: true,
    data: {
      genre,
      movies,
    },
  });
});
exports.updateGenre = asyncHandler(async (req, res, next) => {
  let genre = await req.db.genre.findByPk(req.params.id);
  if (!genre) {
    throw new MyError("Iim id-tai genre oldsongui", 400);
  }
  genre = await genre.update(req.body);

  res.status(200).json({
    success: true,
    data: genre,
  });
});
