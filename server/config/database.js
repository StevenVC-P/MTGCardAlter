const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("arcane_proxies", "username", "root", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
