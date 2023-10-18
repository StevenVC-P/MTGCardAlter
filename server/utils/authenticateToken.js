const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  // Check if the token exists
  if (!token || token === "null") {
    return res.status(401).json({ message: "Token is missing" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error", err);
      return res.status(403).json({ message: "Token is invalid or expired" });
    }

    // Store the user details in the request object
    req.user = user;
    next();
  });
}


module.exports = authenticateToken;
