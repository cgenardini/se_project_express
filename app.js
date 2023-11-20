require("dotenv").config();
const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { login, createUser } = require("./controllers/user");

const { PORT = 3001 } = process.env;
const { handleNonExistentRoute } = require("./utils/errors");
const { errorHandler } = require("./middlewares/error-handler");
const {
  validateUserInfoBody,
  validateUserLogIn,
} = require("./middlewares/validation");

const { auth } = require("./middlewares/auth");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const app = express();
app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.post("/signin", validateUserLogIn, login);
app.post("/signup", validateUserInfoBody, createUser);

app.use("/users", require("./routes/user"));
app.use("/items", require("./routes/clothingItem"));

app.use(errorLogger);

app.use(handleNonExistentRoute);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Port is running");
});
