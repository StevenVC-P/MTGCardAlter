// db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  user: "root",
  host: "localhost",
  database: "arcane_proxies",
  password: "root",
  port: 3306,
});

module.exports = pool;
