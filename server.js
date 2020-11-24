//////////////////////////
// SERVER SETUP //
//////////////////////////

// Dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

// Setting Up Express
const PORT = process.env.PORT || 3500;
const app = express();

// Setting Up Morgan Middleware
app.use(logger("dev"));

// Configuring Express App
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Setting Up Mongo
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

// Setting Up Route
app.use(require("./routes/api.js"));

// Listen for Take Off
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});