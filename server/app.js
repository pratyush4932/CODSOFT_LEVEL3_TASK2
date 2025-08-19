import express from "express";
import cors from "cors";
import authrouter from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-auth-token",
    "Origin",
    "Accept",
    "X-Requested-With",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${
      req.headers.origin || "No origin"
    }`
  );
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

app.use(express.json());

// Runtime config for front-end: exposes CLIENT_URL without bundling
app.get("/config.js", (req, res) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.type("application/javascript").send(
    `window.CLIENT_URL = ${JSON.stringify(clientUrl)};\n`
  );
});

// Serve static files (e.g., email-verified.html) from the public/ directory
app.use(express.static("public"));

app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.use("/api/auth/", authrouter);
app.use("/api/proj/", projectRoutes);
app.use("/api/task/", taskRoutes);

export default app;
