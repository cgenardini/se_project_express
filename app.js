require("dotenv").config();
const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");

const { login, createUser } = require("./controllers/user");

const { PORT = 3001 } = process.env;
const { handleNonExistentRoute } = require("./utils/errors");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/users", require("./routes/user"));
app.use("/items", require("./routes/clothingItem"));

app.use(handleNonExistentRoute);

app.listen(PORT, () => {
  console.log("Port is running");
});
