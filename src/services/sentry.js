import * as Sentry from "@sentry/node";

let enabled = false;

export const initSentry = (app) => {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    console.warn("Sentry DSN not provided; Sentry disabled.");
    return;
  }
  try {
    Sentry.init({ dsn, tracesSampleRate: 1.0 });
    app.use(Sentry.Handlers.requestHandler());
    enabled = true;
    console.log("Sentry initialized");
  } catch (err) {
    console.error("Failed to initialize Sentry:", err);
  }
};

export const sentryErrorHandler = (app) => {
  if (!enabled) return;
  try {
    app.use(Sentry.Handlers.errorHandler());
  } catch (err) {
    console.error("Failed to mount Sentry error handler:", err);
  }
};

export const captureException = (err) => {
  if (!enabled) return;
  try {
    Sentry.captureException(err);
  } catch (e) {
    console.error("Sentry capture failed:", e);
  }
};

export default { initSentry, sentryErrorHandler, captureException };
