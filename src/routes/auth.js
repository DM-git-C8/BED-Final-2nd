import express from "express";
import jwt from "jsonwebtoken";
import { validateUser } from "../services/authService.js";

const router = express.Router();
const secret = process.env.JWT_SECRET || "secret";

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "username and password required" });
    const user = await validateUser(username, password);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, username: user.username }, secret, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;
