const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");

exports.addMovieActor = asyncHandler(async (req, res, next) => {
  const movieActor = await req.db.movieActor.create(req.body);

  await movieActor.save();

  res.status(200).json({
    success: true,
    data: movieActor,
  });
});

exports.addMovieAuthor = asyncHandler(async (req, res, next) => {
  const movieAuthor = await req.db.movieAuthor.create(req.body);

  await movieAuthor.save();

  res.status(200).json({
    success: true,
    data: movieAuthor,
  });
});

exports.addMovieDirector = asyncHandler(async (req, res, next) => {
  const movieDirector = await req.db.movieDirector.create(req.body);

  await movieDirector.save();

  res.status(200).json({
    success: true,
    data: movieDirector,
  });
});
