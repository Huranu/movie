const express = require("express");
const router = express.Router();
// const { protect, authorize } = require("../middleware/protect");

const { addStaff } = require("../controller/staffs");

router.route("/").post(addStaff);

module.exports = router;
