// db.js
const mysql = require("mysql2/promise");
const { env } = require("./env/config");

const { USER, HOST, DATABASE, PASSWORD, PORT} = env;

const pool = mysql.createPool({
  user: USER,
  host: HOST,
  database: DATABASE,
  password: PASSWORD,
  port: PORT,
});

async function getUserById(id, provider = null) {
  let query = "SELECT * FROM users WHERE ";
  if (provider === "google") query += "google_id = ?";
  else if (provider === "facebook") query += "facebook_id = ?";
  else if (provider === "patreon") query += "patreon_id = ?";
  else query += "id = ?";

  const [rows] = await pool.query(query, [id]);
  return rows[0];
}

async function createUser(user, provider = null) {
  let query = "INSERT INTO users (";
  if (provider === "google") query += "google_id, email, name, picture";
  else if (provider === "facebook") query += "facebook_id, email, name, picture";
  else if (provider === "patreon") query += "patreon_id, email, name";

  query += ") VALUES (?, ?, ?, ?)";

  const { id, email, name, picture } = user;
  const [result] = await pool.query(query, [id, email, name, picture]);
  if (result.affectedRows > 0) {
    return getUserById(id, provider);
  }
  return null;
}

module.exports = {
  pool,
  getUserById,
  createUser,
};
