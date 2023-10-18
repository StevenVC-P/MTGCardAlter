const fs = require("fs");

const privateKey = fs.readFileSync("./new_server.cert", "utf8");
const certificate = fs.readFileSync("./new_server.key", "utf8");

module.exports = {
  credentials: { key: privateKey, cert: certificate },
};
