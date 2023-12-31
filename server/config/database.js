const { Sequelize } = require("sequelize");

const { env } = require("../../env/config");

const { USER, HOST, DATABASE, PASSWORD, } = env;

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  host: HOST,
  dialect: "mysql",
});

module.exports = sequelize;
