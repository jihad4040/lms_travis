// import { v2 as cloudinary } from 'cloudinary';
import { envVers } from "./env";

// cloudinary.config({
//     cloud_name: envVers.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
//     api_key: envVers.CLOUDINARY.CLOUDINARY_API_KEY,
//     api_secret: envVers.CLOUDINARY.CLOUDINARY_API_SECRATE
// });

// export const cloudinaryUpload = cloudinary;

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: envVers.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVers.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVers.CLOUDINARY.CLOUDINARY_API_SECRATE,
  // ✅ Add these for large file upload
  secure: true,
  upload_preset: undefined, // Remove if you have one
});

export const cloudinaryUpload = cloudinary;
