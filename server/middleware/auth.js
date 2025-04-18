import jwt from "jsonwebtoken";
const SECRET = "brainybox_secret";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token", err });
  }
};
