const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
} = require("../controller/categories");

router.route("/").post(createCategory).get(getCategories);

router
  .route("/:id")
  .put(updateCategory)
  .delete(deleteCategory)
  .get(getCategory);

module.exports = router;
