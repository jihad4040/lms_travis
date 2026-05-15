import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";
import { Request } from "express";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req: Request, file: Express.Multer.File) => {
    const fileExtension = file.originalname.split(".").pop() || "";

    const baseFileName = file.originalname
      .replace(`.${fileExtension}`, "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    const uniqueId = `${Math.random().toString(36).substring(2)}-${Date.now()}-${baseFileName}`;

    let resourceType: "image" | "video" | "raw" | "auto" = "image";
    let folder = "assets";

    // ✅ SCORM/ZIP files must be 'raw' and keep original extension
    if (
      file.mimetype === "application/zip" ||
      file.mimetype === "application/x-zip-compressed" ||
      fileExtension.toLowerCase() === "zip"
    ) {
      resourceType = "raw";
      folder = "assets/scorm"; // Separate folder for SCORM
      // ⚠️ IMPORTANT: Don't specify format for ZIP files
      return {
        folder: folder,
        public_id: uniqueId,
        resource_type: resourceType,
        format: "zip",
      };
    }
    // PDF files
    else if (file.mimetype === "application/pdf") {
      resourceType = "raw";
      folder = "assets/pdf";
      return {
        folder: folder,
        public_id: uniqueId,
        resource_type: resourceType,
        format: "pdf",
      };
    }
    // Video files
    else if (file.mimetype.startsWith("video/")) {
      resourceType = "video";
      folder = "assets/videos";
    }
    // Audio files (must use 'video' resource type)
    else if (file.mimetype.startsWith("audio/")) {
      resourceType = "video";
      folder = "assets/audio";
    }
    // Image files
    else if (file.mimetype.startsWith("image/")) {
      resourceType = "image";
      folder = "assets/images";
    }

    return {
      folder: folder,
      public_id: uniqueId,
      resource_type: resourceType,
      format: fileExtension,
    };
  },
});

export const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // ✅ 100MB limit (SCORM files can be large)
  },
  fileFilter: (req, file, cb) => {
    // ✅ Allowed MIME types
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/mpeg",
      "video/webm",
      "video/quicktime",
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "application/pdf",
      "application/zip",
      "application/x-zip-compressed",
      "application/octet-stream", // Some ZIP files use this
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not supported`));
    }
  },
});
