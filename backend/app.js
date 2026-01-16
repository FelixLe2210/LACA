const express = require("express");
const app = express();

app.use(express.json());
app.use("/api/auth", require("./src/routes/auth.route"));

const errorHandler = require("./src/middlewares/error.middleware");
app.use(errorHandler);

module.exports = app;
