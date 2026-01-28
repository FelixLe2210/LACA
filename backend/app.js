const express = require("express");
const app = express();
const feedbackRouter = require('./routes/feedback.route');
const reportRouter = require('./routes/report.route');

app.use(express.json());
app.use("/api/auth", require("./src/routes/auth.route"));

const errorHandler = require("./src/middlewares/error.middleware");
app.use(errorHandler);
app.use('/api/feedbacks', feedbackRouter);
app.use('/api/reports', reportRouter);
module.exports = app;
