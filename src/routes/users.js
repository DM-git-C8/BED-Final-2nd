import express from "express";
import * as usersService from "../services/users.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { username, email } = req.query;
    const users = await usersService.getAllUsers({ username, email });

    // If username or email filter provided and nothing matches, return 404
    if ((username || email) && (!users || users.length === 0)) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    const { username, password, name, email } = req.body;
    if (!username || !password || !name || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const created = await usersService.createUser(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const updated = await usersService.updateUser(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const deleted = await usersService.deleteUserWithDependencies(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
