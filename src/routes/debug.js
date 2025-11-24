import express from "express";

const router = express.Router();

// Throws an error so you can verify Sentry captures it (only enabled
// when you mount the route via `ENABLE_SENTRY_DEBUG=true`).
router.get("/sentry", (req, res) => {
  throw new Error("Sentry test error");
});

export default router;
