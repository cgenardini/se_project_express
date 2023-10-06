const express = require("express");

const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const { handleNonExistentRoute } = require("./utils/errors");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "651ddc868f5eacbdf30787c6",
  };
  next();
});

app.use("/users", require("./routes/user"));
app.use("/items", require("./routes/clothingItem"));

app.use(handleNonExistentRoute);

app.listen(PORT, () => {
  console.log("Port is running");
});
