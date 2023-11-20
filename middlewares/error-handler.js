module.exports.errorHandler = (err, req, res, next) => {
  console.error(err);

  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message:
        statusCode === 500 ? "An Error has occurred on the server" : message,
    });
};
