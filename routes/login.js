const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const { login } = require("../controller/userThings");

router.route("/").post(login);

module.exports = router;
