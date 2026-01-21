import mongoose from "mongoose";
import { MONGODB_URI, PORT, BACKEND_URL } from "./shared/config/env.config.js";
import app from "./server.js";

const startServer = async () => {
  if (!MONGODB_URI) {
    console.error("\nMONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    console.log("\nConnecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.");
    app.listen(PORT, () => {
      console.log(`\nServer is running on ${BACKEND_URL}`);
    });
  } catch (error) {
    console.log("\nFailed to connect to the database.");
    console.error("Details: ", error);
    process.exit(1);
  }
};

startServer();

const shutdownServer = async (signal: string) => {
  console.log(`\nReceived ${signal}. Closing MongoDB connection...`);
  await mongoose.connection.close();
  process.exit(0);
};

process.on("SIGINT", () => shutdownServer("SIGINT"));
process.on("SIGTERM", () => shutdownServer("SIGTERM"));
process.on("SIGUSR2", () => shutdownServer("SIGUSR2"));
