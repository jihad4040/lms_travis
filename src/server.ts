import mongoose from "mongoose";
import { Server } from "http";
import { envVers } from "./app/config/env";
import { app } from "./app";
import { seedAdmin } from "./app/config/seedAdmin";
import "dotenv/config";

let server: Server;

const boostServer = async () => {
  try {
    await mongoose.connect(envVers.MONGO_URI);
    console.log("MongoDb Connected Successfully");
    await seedAdmin();
    server = app.listen(Number(envVers.PORT), "0.0.0.0", () => {
      console.log("Server runing successfully");
      console.log(`http://localhost:${envVers.PORT}`);
    });
  } catch (error: any) {
    console.log("Mongoose Connection Error", error.message);
  }
};

(async () => {
  await boostServer();
})();

process.on("SIGTERM", () => {
  console.log("Sigterm singnal detected... Server shuting down.");

  if (server) {
    server.close(() => {
      process.exit(0);
    });
  }
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Sigint signal detected... Server shuting doen.");

  if (server) {
    server.close(() => {
      process.exit(0);
    });
  }
  process.exit(0);
});

process.on("uncaughtException", (error: any) => {
  console.error("Uncaught Exception:", error);

  // Check if this is a Cloudinary upload error (e.g. file size too large or upload failures)
  const isCloudinaryError =
    error &&
    (error.http_code === 400 ||
      error.http_code === 404 ||
      (error.message && error.message.includes("cloudinary")) ||
      (error.message && error.message.includes("File size too large"))
    );

  if (isCloudinaryError) {
    console.warn("⚠️ Safe to ignore: Uncaught exception from Cloudinary upload. Keeping server alive.");
    return;
  }

  console.log("UncaughtException detected... Server shutting down.");
  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("unhandledRejection", (reason: any, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);

  // Check if this is a Cloudinary upload error (e.g. file size too large or upload failures)
  const isCloudinaryError =
    reason &&
    (reason.http_code === 400 ||
      reason.http_code === 404 ||
      (reason.message && reason.message.includes("cloudinary")) ||
      (reason.message && reason.message.includes("File size too large"))
    );

  if (isCloudinaryError) {
    console.warn("⚠️ Safe to ignore: Unhandled rejection from Cloudinary upload. Keeping server alive.");
    return;
  }

  console.log("UnhandledRejection detected... Server shutting down.");
  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

