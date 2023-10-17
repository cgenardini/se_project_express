const notFound = 404;
const serverError = 500;
const invalidData = 400;
const forbiddenError = 403;
const authError = 401;
const conflictError = 409;

function handleNonExistentRoute(req, res) {
  res.status(notFound).send({
    message: "Requested resource not found",
  });
}

module.exports = {
  handleNonExistentRoute,
  notFound,
  serverError,
  invalidData,
  forbiddenError,
  authError,
  conflictError,
};
