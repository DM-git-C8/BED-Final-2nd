import express from "express";
import * as propertiesService from "../services/properties.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /properties
 * Optional query params:
 * - location
 * - pricePerNight
 *
 * Always returns 200 with an array (possibly empty)
 */
router.get("/", async (req, res, next) => {
  try {
    const { location, pricePerNight } = req.query;

    const props = await propertiesService.getAllProperties({
      location,
      pricePerNight,
    });

    // IMPORTANT:
    // Filters should NEVER return 404
    // An empty result set is valid
    res.json(props);
  } catch (err) {
    next(err);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    const {
      title,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
    } = req.body;

    if (
      !title ||
      !location ||
      pricePerNight == null ||
      bedroomCount == null ||
      bathRoomCount == null ||
      maxGuestCount == null ||
      !hostId
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const created = await propertiesService.createProperty(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const prop = await propertiesService.getPropertyById(req.params.id);

    if (!prop) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(prop);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const updated = await propertiesService.updateProperty(
      req.params.id,
      req.body
    );

    if (!updated) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const deleted = await propertiesService.deleteProperty(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
