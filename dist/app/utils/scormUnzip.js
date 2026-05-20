"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processScormZip = void 0;
const axios_1 = __importDefault(require("axios"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const cloudinary_config_1 = require("../config/cloudinary.config");
const processScormZip = async (zipUrl) => {
    try {
        // 1. Download the ZIP file from Cloudinary
        const response = await axios_1.default.get(zipUrl, { responseType: "arraybuffer" });
        const zip = new adm_zip_1.default(Buffer.from(response.data));
        const zipEntries = zip.getEntries();
        const uploadPromises = zipEntries
            .filter((entry) => {
            if (entry.isDirectory)
                return false;
            const entryName = entry.entryName;
            // Ignore OS-specific/hidden metadata and system files
            if (entryName.includes("__MACOSX") ||
                entryName.includes(".DS_Store") ||
                entryName.endsWith("Thumbs.db") ||
                entryName.endsWith("desktop.ini") ||
                entryName.split(/[/\\]/).some((part) => part.startsWith("."))) {
                return false;
            }
            return true;
        })
            .map(async (entry) => {
            const buffer = entry.getData();
            // Support both POSIX (/) and Windows (\) path separators
            const parts = entry.entryName.split(/[/\\]/);
            const fileName = parts.pop() || entry.entryName;
            const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
            let type = "other";
            let resourceType = "raw";
            if (["mp4", "webm", "ogg", "mov", "flv", "avi"].includes(fileExtension)) {
                type = "video";
                resourceType = "video";
            }
            else if (["mp3", "wav", "mpeg", "m4a", "aac", "wma"].includes(fileExtension)) {
                type = "audio";
                resourceType = "video"; // Cloudinary uses "video" for audio uploads
            }
            else if (["jpg", "jpeg", "png", "gif", "webp", "svg", "ico"].includes(fileExtension)) {
                type = "image";
                resourceType = "image";
            }
            else if (fileExtension === "pdf") {
                type = "pdf";
                resourceType = "raw";
            }
            else if (["html", "htm"].includes(fileExtension)) {
                type = "html";
                resourceType = "raw";
            }
            else if (["txt", "md"].includes(fileExtension)) {
                type = "text";
                resourceType = "raw";
            }
            else {
                resourceType = "raw";
            }
            // 2. Upload to Cloudinary with the correct, explicit resource_type
            const uploadToCloudinary = (fileBuffer, name, resType) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary_config_1.cloudinaryUpload.uploader.upload_stream({
                        resource_type: resType,
                        folder: "assets/scorm_unzipped",
                        public_id: `${Date.now()}-${name.replace(/[^a-z0-9.]/gi, "_")}`,
                    }, (error, result) => {
                        if (error)
                            reject(error);
                        else
                            resolve(result);
                    });
                    uploadStream.end(fileBuffer);
                });
            };
            const result = await uploadToCloudinary(buffer, fileName, resourceType);
            return {
                type,
                contentUrl: result.secure_url,
            };
        });
        const unzippedFiles = await Promise.all(uploadPromises);
        return unzippedFiles;
    }
    catch (error) {
        console.error("Error processing SCORM ZIP:", error);
        throw error;
    }
};
exports.processScormZip = processScormZip;
//# sourceMappingURL=scormUnzip.js.map