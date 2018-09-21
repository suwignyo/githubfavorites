"use strict";

const express = require("express");

const homeRoutes = express.Router();

homeRoutes.get("/", (req, res) => res.json({ msg: "/ works" }));

module.exports = homeRoutes;
