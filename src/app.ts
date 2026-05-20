import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFound } from "./app/utils/notFoundRoute";
import { moduleRoute } from "./app/route/route";
import { globalErrorhandler } from "./app/middleware/global.error.handler";
import passport from "./app/config/pasport.config";

export const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://travisjerovetz-frontend.vercel.app",
      "http://20.236.245.21:3000",
      "http://20.236.245.21",
      "http://learning.awcompaniesinc.com",
      "*",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(passport.initialize());
app.use(cookieParser());

// Module Route
moduleRoute.forEach((item) => {
  app.use(`/v1${item.path}`, item.routes);
  app.use(`/api/v1${item.path}`, item.routes);
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server runing success",
  });
});

app.use(globalErrorhandler);
app.use(notFound);
