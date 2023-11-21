const express = require("express");
const router = express.Router();
// const { protect, authorize } = require("../middleware/protect");

const { register } = require("../controller/userThings");

router.route("/").post(register);

module.exports = router;
