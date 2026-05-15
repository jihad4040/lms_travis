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
            .filter((entry) => !entry.isDirectory)
            .map(async (entry) => {
            const buffer = entry.getData();
            const fileName = entry.entryName.split("/").pop() || entry.entryName;
            const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
            let type = "other";
            if (["mp4", "webm", "ogg"].includes(fileExtension))
                type = "video";
            else if (["mp3", "wav", "mpeg"].includes(fileExtension))
                type = "audio";
            else if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension))
                type = "image";
            else if (fileExtension === "pdf")
                type = "pdf";
            else if (["html", "htm"].includes(fileExtension))
                type = "html";
            else if (["txt", "md"].includes(fileExtension))
                type = "text";
            // 2. Upload to Cloudinary
            const uploadToCloudinary = (fileBuffer, name) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary_config_1.cloudinaryUpload.uploader.upload_stream({
                        resource_type: "auto",
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
            const result = await uploadToCloudinary(buffer, fileName);
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