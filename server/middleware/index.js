const cors = require("cors");
const express = require("express");

module.exports = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.path}`);
    next();
  });
};
