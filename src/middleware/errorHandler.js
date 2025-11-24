import { captureException } from "../services/sentry.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  try {
    captureException(err);
  } catch (e) {
    console.error("Sentry error:", e);
  }

  const code = err?.code;
  if (code === "P2025") {
    return res.status(404).json({ message: "Resource not found" });
  }
  if (code === "P2002") {
    return res.status(400).json({ message: "Unique constraint failed" });
  }

  if (err instanceof SyntaxError || err.name === "ValidationError") {
    return res.status(400).json({ message: "Bad request" });
  }

  res.status(500).json({
    message:
      "An error occurred on the server, please double-check your request!",
  });
};
