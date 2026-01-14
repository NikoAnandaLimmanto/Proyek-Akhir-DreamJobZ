import jwt from "jsonwebtoken";

export const authenticateTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: "Invalid token",
        message: err.message,
      });
    }

    req.user = decoded;
    next();
  });
};
