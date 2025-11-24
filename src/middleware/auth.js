import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "secret";

export const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth)
    return res.status(401).json({ message: "Missing Authorization header" });
  // Accept both 'Bearer <token>' and raw token values
  const parts = auth.split(" ");
  let token;
  if (parts.length === 2 && parts[0] === "Bearer") {
    token = parts[1];
  } else if (parts.length === 1) {
    token = parts[0];
  } else {
    return res.status(401).json({ message: "Invalid Authorization header" });
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
