import express from "express";
import dotenv from "dotenv";
import { initSentry, sentryErrorHandler } from "./services/sentry.js";
import routesUsers from "./routes/users.js";
import routesHosts from "./routes/hosts.js";
import routesProperties from "./routes/properties.js";
import routesBookings from "./routes/bookings.js";
import routesReviews from "./routes/reviews.js";
import routesAuth from "./routes/auth.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Initialize Sentry if a DSN is provided
initSentry(app);

app.use(express.json());
app.use(requestLogger);

app.use("/login", routesAuth);
app.use("/users", routesUsers);
app.use("/hosts", routesHosts);
app.use("/properties", routesProperties);
app.use("/bookings", routesBookings);
app.use("/reviews", routesReviews);

app.get("/", (req, res) => res.send("Booking API is running"));

if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Let Sentry handle errors first (if enabled), then our handler
sentryErrorHandler(app);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Optionally mount debug route for Sentry testing
if (process.env.ENABLE_SENTRY_DEBUG === "true") {
  import("./routes/debug.js").then((m) => {
    app.use("/debug", m.default);
  });
}
