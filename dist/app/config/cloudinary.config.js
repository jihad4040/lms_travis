"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUpload = void 0;
// import { v2 as cloudinary } from 'cloudinary';
const env_1 = require("./env");
// cloudinary.config({
//     cloud_name: envVers.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
//     api_key: envVers.CLOUDINARY.CLOUDINARY_API_KEY,
//     api_secret: envVers.CLOUDINARY.CLOUDINARY_API_SECRATE
// });
// export const cloudinaryUpload = cloudinary;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: env_1.envVers.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.envVers.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: env_1.envVers.CLOUDINARY.CLOUDINARY_API_SECRATE,
    // ✅ Add these for large file upload
    secure: true,
    upload_preset: undefined, // Remove if you have one
});
exports.cloudinaryUpload = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.config.js.map