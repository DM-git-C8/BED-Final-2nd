import express from "express";
import * as hostsService from "../services/hosts.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /hosts
 * Optional query params:
 * - name
 *
 * Always returns 200 with an array (possibly empty)
 */
router.get("/", async (req, res, next) => {
  try {
    const { name } = req.query;

    const hosts = await hostsService.getAllHosts({ name });

    // IMPORTANT:
    // Filters should NEVER return 404
    // An empty result set is valid
    res.json(hosts);
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

    const created = await hostsService.createHost(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const host = await hostsService.getHostById(req.params.id);

    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    }

    res.json(host);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const updated = await hostsService.updateHost(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Host not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const deleted = await hostsService.deleteHostWithDependencies(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({ message: "Host not found" });
    }

    res.json({ message: "Host deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
