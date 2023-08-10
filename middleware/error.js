const errorHandler = (err, req, res, next) => {
  console.log(err.stack.red);

  const error = { ...err };

  error.message = err.message;

  if (error.name === "CastError") {
    error.message = "Ene ID buruu butetstei baina";
    error.statusCode = 400;
  }
  if (error.code === 11000) {
    error.message = "Talbariin utga davhardsan baina";
    error.statusCode = 400;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error,
  });
};

module.exports = errorHandler;
