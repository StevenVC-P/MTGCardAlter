const cors = require("cors");
const express = require("express");
const path = require("path");


module.exports = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.path}`);
    next();
  });
};
