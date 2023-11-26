const NotFoundError = require("./errors/notFoundError");

const notFound = 404;
const serverError = 500;
const invalidData = 400;
const forbiddenError = 403;
const authError = 401;
const conflictError = 409;

function handleNonExistentRoute() {
  throw new NotFoundError("Requested resource not found");
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
