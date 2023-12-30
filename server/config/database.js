const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("arcane_proxies", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
