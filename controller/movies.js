const Movie = require("../models/sequelize/movie");
const path = require("path");
const MyError = require("../utils/myError");
const paginate = require("../utils/paginate");
const asyncHandler = require("express-async-handler");

exports.getMovies = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  // Pagination
  const pagination = await paginate(page, limit, req.db.movie);

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
  const movies = await req.db.movie.findAll(Query);

  res.status(200).json({
    success: true,
    data: movies,
    pagination,
  });
});

exports.getMovie = asyncHandler(async (req, res, next) => {
  const movie = await req.db.movie.findAll({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: req.db.movieActor,
        attributes: ["id"],
        include: [
          {
            model: req.db.staff,
            attributes: ["id", "firstname", "lastname"],
          },
        ],
      },
      {
        model: req.db.movieAuthor,
        attributes: ["id"],
        include: [
          {
            model: req.db.staff,
            attributes: ["id", "firstname", "lastname"],
          },
        ],
      },
      {
        model: req.db.movieDirector,
        attributes: ["id"],
        include: [
          {
            model: req.db.staff,
            attributes: ["id", "firstname", "lastname"],
          },
        ],
      },
    ],
  });

  if (!movie) {
    throw new MyError("Iim id-tai kino baihgui baina", 400);
  }

  res.status(200).json({
    success: true,
    data: movie,
  });
});

exports.createMovie = asyncHandler(async (req, res, next) => {
  const movie = await req.db.movie.create(req.body);

  await movie.save();

  res.status(200).json({
    success: true,
    data: movie,
  });
});

exports.deleteMovie = asyncHandler(async (req, res, next) => {
  const movie = await req.db.movie.findByPk(req.params.id);

  if (!movie) {
    throw new MyError("Iim id-tai kino baihgui baina", 400);
  }

  movie.destroy();

  res.status(200).json({
    success: true,
    data: movie,
  });
});

exports.updateMovie = asyncHandler(async (req, res, next) => {
  let movie = await req.db.movie.findByPk(req.params.id);

  if (!movie) {
    throw new MyError("Iim id-tai kino baihgui baina", 400);
  }

  movie = await movie.update(req.body);

  res.status(200).json({
    success: true,
    data: movie,
  });
});
