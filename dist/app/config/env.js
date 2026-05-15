"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVers = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envChecker = () => {
    const requiredEnv = [
        "MONGO_URI",
        "PORT",
        "DEV_ENVIRONMENT",
        "ACCESS_SECRATE",
        "REFRESH_SECRATE",
        "CLOUDINARY_API_SECRATE",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
        "ADMIN_NAME",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_PASS",
        "SMTP_USER",
        "MICROSOFT_REDIRECT_URL",
        "CLIENT_ID",
        "CLIENT_SECRATE",
    ];
    requiredEnv.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Required env messing : ${key}`);
        }
    });
    return {
        MONGO_URI: process.env.MONGO_URI,
        PORT: process.env.PORT,
        DEV_ENVIRONMENT: process.env.DEV_ENVIRONMENT,
        REFRESH_SECRATE: process.env.REFRESH_SECRATE,
        ACCESS_SECRATE: process.env.ACCESS_SECRATE,
        CLOUDINARY: {
            CLOUDINARY_API_SECRATE: process.env.CLOUDINARY_API_SECRATE,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        },
        ADMIN: {
            ADMIN_EMAIL: process.env.ADMIN_EMAIL,
            ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
            ADMIN_NAME: process.env.ADMIN_NAME,
        },
        EMAIL_SENDER: {
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_PASS: process.env.SMTP_PASS,
            SMTP_USER: process.env.SMTP_USER,
        },
        MICROSOFT: {
            MICROSOFT_REDIRECT_URL: process.env.MICROSOFT_REDIRECT_URL,
            CLIENT_ID: process.env.CLIENT_ID,
            CLIENT_SECRATE: process.env.CLIENT_SECRATE,
        },
    };
};
exports.envVers = envChecker();
//# sourceMappingURL=env.js.map