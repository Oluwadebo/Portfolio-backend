import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db";

import analytics from "./routes/analytics";
import auth from "./routes/auth";
import project from "./routes/project";
import upload from "./routes/upload";
import view from "./routes/view";
// import Settings from "../../routes/Settings";
import Settings from "./routes/Settings";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;
// console.log(Settings);

// ─── Middleware ─────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ────────────────────────────────────────
app.use("/api/auth", auth);
app.use("/api/projects", project);
app.use("/api/analytics", analytics);
app.use("/api/upload", upload);
app.use("/api/view", view);
app.use("/api/settings", Settings);

// ─── Health check ──────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── 404 handler ───────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global error handler ──────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
  },
);
connectDB();

app.listen(PORT, () => {
  console.log(`\n🚀 Backend running on http://localhost:${PORT}`);
});

export default app;
