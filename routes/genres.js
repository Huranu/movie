const express = require("express");
const router = express.Router();

const {
  createGenre,
  updateGenre,
  deleteGenre,
  getGenres,
  getGenre,
} = require("../controller/genres");

router.route("/").post(createGenre).get(getGenres);

router.route("/:id").put(updateGenre).delete(deleteGenre).get(getGenre);

module.exports = router;
