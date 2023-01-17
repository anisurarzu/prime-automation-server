const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");

// express app initialization
const app = express();

dotenv.config();
app.use(express.json());
app.options("*", cors());

// database connection with mongoose
mongoose
  .connect(
    `mongodb+srv://anis:anis123@cluster0.c8lf0v2.mongodb.net/primeDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

// application routes
app.use("/todo", todoHandler);
app.use("/user", userHandler);

// default error handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};

app.use(errorHandler);

app.listen(5000, () => {
  console.log("app listening at port 5000");
});
app.get("/", (req, res) => {
  res.send("dmf server two is running");
});
