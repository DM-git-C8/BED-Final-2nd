import express from "express";
import * as bookingsService from "../services/bookings.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { userId } = req.query;
    const bookings = await bookingsService.getAllBookings({ userId });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    const {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;
    if (
      !userId ||
      !propertyId ||
      !checkinDate ||
      !checkoutDate ||
      numberOfGuests == null ||
      totalPrice == null ||
      !bookingStatus
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const created = await bookingsService.createBooking(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const booking = await bookingsService.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const updated = await bookingsService.updateBooking(
      req.params.id,
      req.body
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    await bookingsService.deleteBooking(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
