import dotEnv from "dotenv";

dotEnv.config();

interface IEnv {
  MONGO_URI: string;
  PORT: string;
  DEV_ENVIRONMENT: string;
  ACCESS_SECRATE: string;
  REFRESH_SECRATE: string;
  ADMIN: {
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
    ADMIN_NAME: string;
  };
  CLOUDINARY: {
    CLOUDINARY_API_SECRATE: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_CLOUD_NAME: string;
  };
  EMAIL_SENDER: {
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_PASS: string;
    SMTP_USER: string;
  };
  MICROSOFT: {
    MICROSOFT_REDIRECT_URL: string;
    CLIENT_ID: string;
    CLIENT_SECRATE: string;
    TENANT: string;
  };
}

const envChecker = (): IEnv => {
  const requiredEnv: string[] = [
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
    MONGO_URI: process.env.MONGO_URI as string,
    PORT: process.env.PORT as string,
    DEV_ENVIRONMENT: process.env.DEV_ENVIRONMENT as string,
    REFRESH_SECRATE: process.env.REFRESH_SECRATE as string,
    ACCESS_SECRATE: process.env.ACCESS_SECRATE as string,
    CLOUDINARY: {
      CLOUDINARY_API_SECRATE: process.env.CLOUDINARY_API_SECRATE as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    },
    ADMIN: {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
      ADMIN_NAME: process.env.ADMIN_NAME as string,
    },
    EMAIL_SENDER: {
      SMTP_HOST: process.env.SMTP_HOST as string,
      SMTP_PORT: process.env.SMTP_PORT as string,
      SMTP_PASS: process.env.SMTP_PASS as string,
      SMTP_USER: process.env.SMTP_USER as string,
    },
    MICROSOFT: {
      MICROSOFT_REDIRECT_URL: process.env.MICROSOFT_REDIRECT_URL as string,
      CLIENT_ID: process.env.CLIENT_ID as string,
      CLIENT_SECRATE: process.env.CLIENT_SECRATE as string,
      TENANT: (process.env.MICROSOFT_TENANT as string) || "common",
    },
  };
};

export const envVers = envChecker();
