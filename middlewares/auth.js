const jwt = require("jsonwebtoken");

const UnauthorizedError = require("../utils/errors/unauthorizedError");

const secret = process.env.JWT_SECRET || "secret-key";

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("authorization required");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch {
    next(new UnauthorizedError("authorization required"));
  }

  req.user = payload;

  return next();
};
