const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const parts = authorizationHeader.split(" ");
  const token = parts[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    req.user = decoded;

    next();
  });
};

module.exports = verifyToken;
