import express from "express";
import * as reviewsService from "../services/reviews.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const reviews = await reviewsService.getAllReviews();
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    const { userId, propertyId, rating } = req.body;
    if (!userId || !propertyId || rating == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const created = await reviewsService.createReview(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const review = await reviewsService.getReviewById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const updated = await reviewsService.updateReview(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    await reviewsService.deleteReview(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
