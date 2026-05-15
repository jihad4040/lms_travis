import axios from "axios";
import AdmZip from "adm-zip";
import { cloudinaryUpload } from "../config/cloudinary.config";

export const processScormZip = async (zipUrl: string) => {
  try {
    // 1. Download the ZIP file from Cloudinary
    const response = await axios.get(zipUrl, { responseType: "arraybuffer" });
    const zip = new AdmZip(Buffer.from(response.data));
    const zipEntries = zip.getEntries();

    const uploadPromises = zipEntries
      .filter((entry) => !entry.isDirectory)
      .map(async (entry) => {
        const buffer = entry.getData();
        const fileName = entry.entryName.split("/").pop() || entry.entryName;
        const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

        let type = "other";
        if (["mp4", "webm", "ogg"].includes(fileExtension)) type = "video";
        else if (["mp3", "wav", "mpeg"].includes(fileExtension)) type = "audio";
        else if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) type = "image";
        else if (fileExtension === "pdf") type = "pdf";
        else if (["html", "htm"].includes(fileExtension)) type = "html";
        else if (["txt", "md"].includes(fileExtension)) type = "text";

        // 2. Upload to Cloudinary
        const uploadToCloudinary = (fileBuffer: Buffer, name: string): Promise<any> => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinaryUpload.uploader.upload_stream(
              {
                resource_type: "auto",
                folder: "assets/scorm_unzipped",
                public_id: `${Date.now()}-${name.replace(/[^a-z0-9.]/gi, "_")}`,
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
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
  } catch (error) {
    console.error("Error processing SCORM ZIP:", error);
    throw error;
  }
};
