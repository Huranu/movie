const errorHandler = (err, req, res, next) => {
  console.log(err.stack);

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
  if (error.message === "email must be unique") {
    error.message = "Ene email-eer burtgeltei uur hereglegch baina!";
    error.status.code = 400;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error,
  });
};

module.exports = errorHandler;
