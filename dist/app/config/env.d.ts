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
    };
}
export declare const envVers: IEnv;
export {};
//# sourceMappingURL=env.d.ts.map