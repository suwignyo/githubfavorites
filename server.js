"use strict";

// Basic express setup:

const PORT = process.env.PORT || 5000;
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const homeRoutes = require("./routes/home");

app.use(express.static(path.join(__dirname, "client/build")));

// app.use("/", homeRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
