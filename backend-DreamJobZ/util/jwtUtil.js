import jwt from "jsonwebtoken";

export const getJwtToken = (user_id, username, role) => {
  const payload = { user_id, username, role };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};