const express = require("express");
const router = express.Router();
// const { protect, authorize } = require("../middleware/protect");

const {
  addMovieActor,
  addMovieAuthor,
  addMovieDirector,
} = require("../controller/movieStaff");

router.route("/actor").post(addMovieActor);

router.route("/author").post(addMovieAuthor);

router.route("/director").post(addMovieDirector);

module.exports = router;
