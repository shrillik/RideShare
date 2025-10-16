import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { handleDemo } from "./routes/demo";
import { searchRides, getAllRides, createRide, seedRides } from "./routes/rides";

let mongoConnected = false;

async function connectMongo() {
  if (mongoConnected) return;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn("MongoDB URI not provided. Ride data will not be available.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    mongoConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect to MongoDB on startup
  connectMongo();

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Ride API routes
  app.get("/api/rides/search", searchRides);
  app.get("/api/rides", getAllRides);
  app.post("/api/rides", createRide);
  app.post("/api/rides/seed", seedRides);

  return app;
}
