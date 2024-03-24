const { Sequelize } = require("sequelize");

const { env } = require("../../env/config");

const { USER, DB_HOST, DATABASE, PASSWORD, } = env;

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
});

module.exports = sequelize;
