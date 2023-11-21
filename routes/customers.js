const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} = require("../controller/customers");

router.route("/").get(protect, authorize("user"), getUsers);

router.route("/:id").put(updateUser).delete(deleteUser).get(getUser);

module.exports = router;
