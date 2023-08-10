const User = require("../models/User");
const MyError = require("../utils/myError");
const paginate = require("../utils/paginate");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    token,
    user,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new MyError("Ugugdul dutuu baina..", 400);
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new MyError("Email bolon passwordoo shalgana uu..", 401);
  }

  const ok = await user.checkPassword(password);

  if (!ok) {
    throw new MyError("Email bolon passwordoo shalgana uu..", 401);
  }

  const token = user.getJsonWebToken();
  const cookieOption = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };

  res.status(200).cookie("amazon-token", token, cookieOption).json({
    success: true,
    token,
    user,
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  // Pagination
  const pagination = await paginate(page, limit, User);

  const users = await User.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: users,
    pagination,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new MyError("Iim id-tai hereglegch baihgui", 400);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new MyError("Iim id-tai hereglegch baihgui", 400);
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new MyError("Iim id-tai hereglegch baihgui", 400);
  }
  user.remove();

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    throw new MyError("Ta email-ee yvuulna uu..", 400);
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new MyError("Iim email-tei hereglegch baihgui", 400);
  }

  const resetToken = user.genPassToken();
  await user.save();
  // await user.save({ validateBeforeSave: false });

  const link = `https://amazon.mn/changepassword/${resetToken}`;
  const message = `Helloo<br><br>Ta namaig sanaj baigaa gesen huselt ilgeesen baina.<br> Doorhi linkeer orj namaig sanahaa bolino uu?<br><br><a href="${link}">${link}</a><br><br>Have a nice day :)`;
  // Email
  const info = await sendEmail({
    email: user.email,
    subject: "Nuuts ug uurchluh huselt",
    message,
  });

  console.log("Message sent: %s", info.messageId);

  res.status(200).json({
    success: true,
    resetToken,
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.resetToken || !req.body.password) {
    throw new MyError("Ta solih nuuts ug bolon tokenoo ilgeene uu..", 400);
  }

  const encrypted = crypto
    .createHash("sha256")
    .update(req.body.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: encrypted,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new MyError("Token huchingui baina..", 400);
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  const token = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    token,
    user,
  });
});
