const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
exports.addStaff = asyncHandler(async (req, res, next) => {
  const staff = await req.db.staff.create(req.body);

  await staff.save();

  res.status(200).json({
    success: true,
    data: staff,
  });
});
