const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new MyError("Ugugdul dutuu baina..", 400);
  }
  const user = await req.db.customer.findOne({ where: { email } });

  if (!user) {
    throw new MyError("Email bolon passwordoo shalgana uu..", 401);
  }

  const ok = await bcrypt.compareSync(password, user.password);

  if (!ok) {
    throw new MyError("Email bolon passwordoo shalgana uu..", 401);
  }

  const token = user.getToken();

  res.status(200).cookie("token", token).json({
    success: true,
    user,
    token,
  });
});
exports.register = asyncHandler(async (req, res, next) => {
  const customer = await req.db.customer.create(req.body);

  res.status(200).json({
    success: true,
    data: customer,
  });
});
