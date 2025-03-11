const express = require("express");
const cluster = require("cluster");
const os = require("os");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const winston = require("winston");
const connectDB = require("./config/db");
const cronJobs = require("./cronJobs");
const apiLimiter = require("./middlewares/rateLimiter");


dotenv.config();
connectDB();

const numCPUs = os.cpus().length;

// Clustering for Performance
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const app = express();

  // Security Middleware
  app.use(cors());
  app.use(express.json());
  app.use(helmet());

  // Rate Limiting (100 requests per 15 min per IP)
  app.use(apiLimiter);

  // Winston Logger
  const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: "logs/error.log", level: "error" }),
      new winston.transports.File({ filename: "logs/combined.log" }),
    ],
  });

  // Logging Middleware
  app.use((req, res, next) => {
    logger.info({ method: req.method, url: req.url, timestamp: new Date().toISOString() });
    next();
  });

  // Routes
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/user", require("./routes/userRoutes"));
  app.use("/api/tasks", require("./routes/taskRoutes"));
  app.use("/api/logs", require("./routes/logRoutes"));

  // Error Handling Middleware
  app.use((err, req, res, next) => {
    logger.error({ message: err.message, stack: err.stack });
    res.status(500).json({ error: "Internal Server Error" });
  });

  // Start Server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Worker ${process.pid} running on port ${PORT}`));
}
