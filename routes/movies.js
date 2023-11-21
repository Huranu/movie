const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getMovies,
  getMovie,
  createMovie,
  deleteMovie,
  updateMovie,
} = require("../controller/movies");

const router = express.Router();

router.route("/").get(getMovies).post(createMovie);

router.route("/:id").get(getMovie).delete(deleteMovie).put(updateMovie);

module.exports = router;
