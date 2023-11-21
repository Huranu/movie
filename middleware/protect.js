const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const MyError = require("../utils/myError");

exports.protect = asyncHandler(async (req, res, next) => {
  let token = null;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies) {
    console.log(req.cookies);
    token = req.cookies["token"];
  }

  if (!token) {
    throw new MyError("Ta ehleed login hiine uu. Uildel hiih bolomjgui..", 401);
  }

  const tokenObj = jwt.verify(token, process.env.JWT_SECRET);

  req.userId = tokenObj.id;
  req.userRole = tokenObj.role;

  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      throw new MyError("Tanii erh hurehgui baina.." + req.userRole, 403);
    }
    next();
  };
};
