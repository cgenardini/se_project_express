function handleNonExistentRoute(req, res) {
  res.status(404).send({
    message: "Requested resource not found",
  });
}

module.exports = {
  handleNonExistentRoute,
  notFound: 404,
  serverError: 500,
  invalidData: 400,
  forbiddenError: 403,
  authError: 401,
  conflictError: 409,
};
